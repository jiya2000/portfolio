/**
 * ✌️ AR GESTURE RATING ENGINE (Vision-Based Augmented Reality)
 * -------------------------------------------------------------
 * Academic Characteristics:
 * 1. Markerless Vision-Based Tracking (MediaPipe Hands 21-landmark model)
 * 2. Natural User Interface (NUI): Gesture Recognition (Victory / Peace ✌️)
 * 3. Spatial Augmentation: 3D Holographic Stars & Sparkles anchored to fingertips in video space
 * 4. Temporal Dwell/Charge Filter: Prevents accidental trigger jitter
 * 5. Audio-Visual Feedback: Procedural Web Audio API arpeggios & particle burst
 */

export class ARGestureRating
{
    constructor()
    {
        this.isOpen = false;
        this.stream = null;
        this.hands = null;
        this.isModelLoading = false;
        this.isModelReady = false;
        this.animationFrameId = null;

        // Gesture state
        this.victoryConfidence = 0; // 0 to 1
        this.victoryHoldTimer = 0;
        this.victoryHoldThreshold = 750; // ms to confirm
        this.isVictoryConfirmed = false;
        this.particles = [];
        this.lastFrameTime = performance.now();

        // Audio synthesizer
        this.audioCtx = null;

        // Rating state
        this.selectedRating = 5;
        this.selectedTags = new Set(['🌟 Outstanding 3D World', '🏎️ Realistic Physics', '✌️ Smooth AR Gesture', '🎓 A+ Academic Project']);

        this.initDOM();
        this.initEvents();
    }

    initDOM()
    {
        // 1. Floating Trigger Button in bottom-right corner
        this.triggerBtn = document.createElement('button');
        this.triggerBtn.className = 'js-ar-rate-btn ar-gesture-trigger-pill';
        this.triggerBtn.setAttribute('title', 'Rate Portfolio with AR Victory Sign (✌️)');
        this.triggerBtn.innerHTML = `
            <div class="pill-pulse"></div>
            <span class="pill-icon">✌️</span>
            <div class="pill-text-wrap">
                <span class="pill-tag">VISION AR</span>
                <span class="pill-title">Rate with ✌️ Gesture</span>
            </div>
        `;
        document.body.appendChild(this.triggerBtn);

        // 2. Fullscreen / Centered AR Scanner Modal
        this.modal = document.createElement('div');
        this.modal.className = 'js-ar-gesture-modal ar-gesture-modal is-hidden';
        this.modal.innerHTML = `
            <div class="ar-gesture-backdrop js-ar-close"></div>
            <div class="ar-gesture-dialog">
                <!-- Top Cyber Bar -->
                <div class="ar-dialog-header">
                    <div class="ar-dialog-badge">
                        <span class="ar-live-dot"></span>
                        VISION AR • REAL-TIME HAND TRACKING
                    </div>
                    <button class="ar-dialog-close js-ar-close" title="Close AR Camera">✕</button>
                </div>

                <div class="ar-dialog-content">
                    <!-- Camera Viewport with AR Canvas -->
                    <div class="ar-camera-stage">
                        <video class="js-ar-webcam ar-webcam" playsinline muted autoplay></video>
                        <canvas class="js-ar-overlay ar-overlay-canvas"></canvas>

                        <!-- Cyber Viewfinder Decorators -->
                        <div class="ar-bracket tl"></div>
                        <div class="ar-bracket tr"></div>
                        <div class="ar-bracket bl"></div>
                        <div class="ar-bracket br"></div>
                        <div class="ar-reticle-crosshair"></div>
                        <div class="ar-laser-scanner"></div>

                        <!-- Instruction Overlay -->
                        <div class="js-ar-instruction ar-instruction">
                            <div class="instruction-symbol">✌️</div>
                            <div class="instruction-title">Show Victory / Peace Sign</div>
                            <div class="instruction-subtitle">Raise Index & Middle fingers to activate the AR rating</div>
                        </div>

                        <!-- Real-time Meter -->
                        <div class="js-ar-meter-wrap ar-meter-wrap">
                            <div class="ar-meter-bar js-ar-meter-bar"></div>
                            <span class="js-ar-meter-label ar-meter-label">SCANNING CAMERA...</span>
                        </div>
                    </div>

                    <!-- Interactive Rating Card (Revealed upon Victory gesture) -->
                    <div class="js-ar-feedback-card ar-feedback-card is-hidden">
                        <div class="feedback-badge">✨ AR VICTORY CONFIRMED</div>
                        <h3 class="feedback-title">Rate Aditi's 3D & AR/VR Experience</h3>
                        <p class="feedback-sub">Spatial gesture recognized via real-time computer vision.</p>

                        <!-- 5 Glowing Stars -->
                        <div class="star-rating-row js-stars-row">
                            <button class="star-btn is-active" data-star="1">★</button>
                            <button class="star-btn is-active" data-star="2">★</button>
                            <button class="star-btn is-active" data-star="3">★</button>
                            <button class="star-btn is-active" data-star="4">★</button>
                            <button class="star-btn is-active" data-star="5">★</button>
                        </div>

                        <!-- Feedback Chips -->
                        <div class="feedback-tags-row js-tags-row">
                            <span class="chip-tag is-selected" data-tag="🌟 Outstanding 3D World">🌟 Outstanding 3D World</span>
                            <span class="chip-tag is-selected" data-tag="🏎️ Realistic Physics">🏎️ Realistic Physics</span>
                            <span class="chip-tag is-selected" data-tag="✌️ Smooth AR Gesture">✌️ Smooth AR Gesture</span>
                            <span class="chip-tag" data-tag="🎵 Futuristic Spatial Sound">🎵 Futuristic Sound</span>
                            <span class="chip-tag is-selected" data-tag="🎓 A+ Academic Project">🎓 A+ Academic Project</span>
                        </div>

                        <textarea class="feedback-textarea js-feedback-text" placeholder="Add an optional comment for the professor or portfolio..." rows="2"></textarea>

                        <div class="feedback-btn-row">
                            <button class="btn-submit-review js-btn-submit">Submit Rating ✨</button>
                            <button class="btn-scan-again js-btn-rescan">Scan ✌️ Again</button>
                        </div>

                        <!-- Success Confirmation View -->
                        <div class="js-feedback-success feedback-success-view is-hidden">
                            <div class="success-icon">🎉</div>
                            <h4>Thank You For Your Review!</h4>
                            <p>Your rating has been saved to the portfolio registry.</p>
                            <button class="btn-done js-ar-close">Return to 3D World</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Bind DOM references
        this.video = this.modal.querySelector('.js-ar-webcam');
        this.canvas = this.modal.querySelector('.js-ar-overlay');
        this.ctx = this.canvas.getContext('2d');
        this.instructionEl = this.modal.querySelector('.js-ar-instruction');
        this.meterWrap = this.modal.querySelector('.js-ar-meter-wrap');
        this.meterBar = this.modal.querySelector('.js-ar-meter-bar');
        this.meterLabel = this.modal.querySelector('.js-ar-meter-label');
        this.feedbackCard = this.modal.querySelector('.js-ar-feedback-card');
        this.feedbackSuccess = this.modal.querySelector('.js-feedback-success');
    }

    initEvents()
    {
        // Open modal
        this.triggerBtn.addEventListener('click', () => {
            this.open();
        });

        // Close triggers
        const closeBtns = this.modal.querySelectorAll('.js-ar-close');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.close();
            });
        });

        // ESC key to close
        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && this.isOpen)
            {
                this.close();
            }
        });

        // Star rating click handlers
        const starBtns = this.modal.querySelectorAll('.js-stars-row .star-btn');
        starBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = parseInt(btn.dataset.star, 10);
                this.setRating(val);
                this.playTone(440 + val * 80, 0.08);
            });
        });

        // Feedback tag chips toggle
        const chipTags = this.modal.querySelectorAll('.js-tags-row .chip-tag');
        chipTags.forEach(chip => {
            chip.addEventListener('click', () => {
                const tag = chip.dataset.tag;
                if(this.selectedTags.has(tag))
                {
                    this.selectedTags.delete(tag);
                    chip.classList.remove('is-selected');
                }
                else
                {
                    this.selectedTags.add(tag);
                    chip.classList.add('is-selected');
                }
                this.playTone(660, 0.05);
            });
        });

        // Submit button
        const submitBtn = this.modal.querySelector('.js-btn-submit');
        if(submitBtn)
        {
            submitBtn.addEventListener('click', () => {
                this.submitRating();
            });
        }

        // Rescan button
        const rescanBtn = this.modal.querySelector('.js-btn-rescan');
        if(rescanBtn)
        {
            rescanBtn.addEventListener('click', () => {
                this.resetScan();
            });
        }
    }

    setRating(val)
    {
        this.selectedRating = val;
        const starBtns = this.modal.querySelectorAll('.js-stars-row .star-btn');
        starBtns.forEach(btn => {
            const starNum = parseInt(btn.dataset.star, 10);
            if(starNum <= val)
            {
                btn.classList.add('is-active');
            }
            else
            {
                btn.classList.remove('is-active');
            }
        });
    }

    submitRating()
    {
        const commentEl = this.modal.querySelector('.js-feedback-text');
        const comment = commentEl ? commentEl.value.trim() : '';

        const reviewData = {
            rating: this.selectedRating,
            tags: Array.from(this.selectedTags),
            comment: comment,
            timestamp: new Date().toISOString(),
            method: 'AR_VICTORY_GESTURE'
        };

        try
        {
            localStorage.setItem('aditi_ar_portfolio_rating', JSON.stringify(reviewData));
        }
        catch(e) {}

        this.playSuccessArpeggio();
        this.spawnConfetti();

        if(this.feedbackSuccess)
        {
            this.feedbackSuccess.classList.remove('is-hidden');
        }

        const submitBtn = this.modal.querySelector('.js-btn-submit');
        if(submitBtn) submitBtn.style.display = 'none';
        const rescanBtn = this.modal.querySelector('.js-btn-rescan');
        if(rescanBtn) rescanBtn.style.display = 'none';
    }

    resetScan()
    {
        this.isVictoryConfirmed = false;
        this.victoryConfidence = 0;
        this.victoryHoldTimer = 0;
        this.feedbackCard.classList.add('is-hidden');
        this.feedbackSuccess.classList.add('is-hidden');

        const submitBtn = this.modal.querySelector('.js-btn-submit');
        if(submitBtn) submitBtn.style.display = '';
        const rescanBtn = this.modal.querySelector('.js-btn-rescan');
        if(rescanBtn) rescanBtn.style.display = '';

        this.instructionEl.classList.remove('is-hidden');
        this.meterLabel.textContent = 'SCANNING HAND...';
        this.meterBar.style.width = '0%';
        this.meterBar.style.background = '';
    }

    async open()
    {
        if(this.isOpen) return;
        this.isOpen = true;
        this.modal.classList.remove('is-hidden');
        this.resetScan();

        // 1. Start Webcam Stream
        try
        {
            this.meterLabel.textContent = 'CONNECTING CAMERA...';
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });
            this.video.srcObject = this.stream;
            await this.video.play();

            // Set canvas resolution to match video
            this.canvas.width = this.video.videoWidth || 640;
            this.canvas.height = this.video.videoHeight || 480;

            this.meterLabel.textContent = 'LOADING AR VISION MODEL...';
            await this.loadMediaPipeHands();
            this.meterLabel.textContent = 'READY! SHOW ✌️ VICTORY SIGN';

            this.lastFrameTime = performance.now();
            this.startTrackingLoop();
        }
        catch(err)
        {
            console.error('AR Camera Error:', err);
            this.meterLabel.textContent = 'CAMERA ACCESS DENIED OR UNAVAILABLE';
            alert('Camera access is required for real-time Augmented Reality hand tracking. Please enable camera permissions in your browser.');
        }
    }

    close()
    {
        this.isOpen = false;
        this.modal.classList.add('is-hidden');

        // Stop camera tracks immediately so user's webcam light turns off
        if(this.stream)
        {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if(this.animationFrameId)
        {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Clear canvas
        if(this.ctx)
        {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    async loadMediaPipeHands()
    {
        if(this.isModelReady && this.hands) return;

        // Dynamically inject MediaPipe Hands script if not present
        if(!window.Hands)
        {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
                script.crossOrigin = 'anonymous';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        this.hands = new window.Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6
        });

        this.hands.onResults((results) => {
            this.onHandResults(results);
        });

        this.isModelReady = true;
    }

    startTrackingLoop()
    {
        const loop = async () => {
            if(!this.isOpen) return;

            if(this.video && this.video.readyState >= 2 && this.hands)
            {
                try
                {
                    await this.hands.send({ image: this.video });
                }
                catch(e) {}
            }

            this.animationFrameId = requestAnimationFrame(loop);
        };

        this.animationFrameId = requestAnimationFrame(loop);
    }

    /**
     * Hand Landmark Processor & AR Augmentation
     */
    onHandResults(results)
    {
        if(!this.ctx || !this.canvas) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        const now = performance.now();
        const delta = Math.min(now - this.lastFrameTime, 100);
        this.lastFrameTime = now;

        // Update and draw floating particles
        this.updateAndDrawParticles(delta);

        if(!results.multiHandLandmarks || results.multiHandLandmarks.length === 0)
        {
            // Hand lost
            this.victoryConfidence = Math.max(0, this.victoryConfidence - delta * 0.002);
            this.updateMeter(this.victoryConfidence, false);
            return;
        }

        const landmarks = results.multiHandLandmarks[0];

        // 1. Evaluate Victory / Peace Gesture (✌️)
        const isVictory = this.checkVictorySign(landmarks);

        // 2. Render Cyber Hand Skeleton in Video Space
        this.drawCyberSkeleton(landmarks, w, h, isVictory);

        if(isVictory)
        {
            this.victoryConfidence = Math.min(1.0, this.victoryConfidence + delta * 0.003);

            // Landmark 8 (Index Tip) & Landmark 12 (Middle Tip) in screen coordinates
            // Note: camera video is mirrored (CSS transform scaleX(-1)), so canvas coordinates match mirrored view
            const indexTip = { x: (1.0 - landmarks[8].x) * w, y: landmarks[8].y * h };
            const middleTip = { x: (1.0 - landmarks[12].x) * w, y: landmarks[12].y * h };

            // 3. SPATIAL AR AUGMENTATION: Anchor 3D rotating holographic stars directly to fingertips!
            this.drawARStar(indexTip.x, indexTip.y, now, '#f59e0b', '#fbbf24');
            this.drawARStar(middleTip.x, middleTip.y, now + 1000, '#a855f7', '#ec4899');

            // 4. Draw holographic electric arc between the two fingertips
            this.drawElectricArc(indexTip, middleTip, now);

            // 5. Emit dynamic floating AR sparkles from fingertips into camera space
            if(Math.random() < 0.45)
            {
                this.spawnSparkle(indexTip.x, indexTip.y, '#f59e0b');
                this.spawnSparkle(middleTip.x, middleTip.y, '#ec4899');
            }

            // 6. Draw Floating AR Hologram Tag above hand
            const centerX = (indexTip.x + middleTip.x) / 2;
            const centerY = Math.min(indexTip.y, middleTip.y) - 45;
            this.drawARHologramBadge(centerX, centerY, this.victoryConfidence);

            // Dwell Accumulator
            this.victoryHoldTimer += delta;
            this.updateMeter(this.victoryHoldTimer / this.victoryHoldThreshold, true);

            if(!this.isVictoryConfirmed && this.victoryHoldTimer >= this.victoryHoldThreshold)
            {
                this.confirmVictoryGesture();
            }
        }
        else
        {
            this.victoryHoldTimer = Math.max(0, this.victoryHoldTimer - delta * 1.5);
            this.victoryConfidence = Math.max(0, this.victoryConfidence - delta * 0.002);
            this.updateMeter(this.victoryConfidence, false);
        }
    }

    /**
     * Pure Mathematical Gesture Recognition for Victory Sign (✌️)
     */
    checkVictorySign(lm)
    {
        const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

        // Condition 1: Index and Middle finger must be EXTENDED (Tip significantly farther from wrist than PIP)
        const indexDistTip = dist(lm[8], lm[0]);
        const indexDistPip = dist(lm[6], lm[0]);
        const isIndexExtended = indexDistTip > indexDistPip * 1.15 && lm[8].y < lm[6].y;

        const midDistTip = dist(lm[12], lm[0]);
        const midDistPip = dist(lm[10], lm[0]);
        const isMidExtended = midDistTip > midDistPip * 1.15 && lm[12].y < lm[10].y;

        // Condition 2: Ring and Pinky finger must be CURLED (Tip closer to wrist/MCP than extended)
        const ringDistTip = dist(lm[16], lm[0]);
        const ringDistPip = dist(lm[14], lm[0]);
        const isRingCurled = (ringDistTip < ringDistPip * 1.05) || (lm[16].y > lm[14].y);

        const pinkyDistTip = dist(lm[20], lm[0]);
        const pinkyDistPip = dist(lm[18], lm[0]);
        const isPinkyCurled = (pinkyDistTip < pinkyDistPip * 1.05) || (lm[20].y > lm[18].y);

        // Condition 3: Distance between index tip and middle tip (forming a 'V' shape)
        const spread = dist(lm[8], lm[12]);
        const isSpread = spread > 0.04;

        return isIndexExtended && isMidExtended && isRingCurled && isPinkyCurled && isSpread;
    }

    /**
     * AR Skeleton Renderer with Neon Glow
     */
    drawCyberSkeleton(landmarks, w, h, isVictory)
    {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],       // Index
            [5, 9], [9, 10], [10, 11], [11, 12],   // Middle
            [9, 13], [13, 14], [14, 15], [15, 16], // Ring
            [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
            [0, 17]                               // Palm base
        ];

        this.ctx.save();
        this.ctx.lineWidth = isVictory ? 3 : 2;
        this.ctx.strokeStyle = isVictory ? 'rgba(236, 72, 153, 0.85)' : 'rgba(56, 189, 248, 0.65)';
        this.ctx.shadowBlur = isVictory ? 12 : 6;
        this.ctx.shadowColor = isVictory ? '#ec4899' : '#38bdf8';

        connections.forEach(([i, j]) => {
            const p1 = { x: (1.0 - landmarks[i].x) * w, y: landmarks[i].y * h };
            const p2 = { x: (1.0 - landmarks[j].x) * w, y: landmarks[j].y * h };

            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        });

        // Draw joint nodes
        landmarks.forEach((lm, idx) => {
            const x = (1.0 - lm.x) * w;
            const y = lm.y * h;
            const isFingertip = (idx === 8 || idx === 12);

            this.ctx.beginPath();
            this.ctx.arc(x, y, isFingertip && isVictory ? 6 : 3, 0, Math.PI * 2);
            this.ctx.fillStyle = (isFingertip && isVictory) ? '#fbbf24' : '#ffffff';
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    /**
     * Spatially Anchored 3D Holographic Rotating Star
     */
    drawARStar(cx, cy, time, colorInner, colorOuter)
    {
        const spikes = 5;
        const outerRadius = 22 + Math.sin(time * 0.008) * 3;
        const innerRadius = 10;
        const rotation = time * 0.003;

        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(rotation);

        // Radial Aura
        const aura = this.ctx.createRadialGradient(0, 0, 2, 0, 0, outerRadius * 1.5);
        aura.addColorStop(0, colorInner);
        aura.addColorStop(0.5, colorOuter);
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = aura;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, outerRadius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        // 5-Point Star Geometry
        let step = Math.PI / spikes;
        this.ctx.beginPath();
        for(let i = 0; i < 2 * spikes; i++)
        {
            let r = (i % 2 === 0) ? outerRadius : innerRadius;
            let x = Math.cos(i * step) * r;
            let y = Math.sin(i * step) * r;
            if(i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();

        this.ctx.fillStyle = colorInner;
        this.ctx.shadowColor = colorOuter;
        this.ctx.shadowBlur = 18;
        this.ctx.fill();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Electric Arc connecting the two Victory fingertips
     */
    drawElectricArc(p1, p2, time)
    {
        this.ctx.save();
        this.ctx.strokeStyle = '#fef08a';
        this.ctx.shadowColor = '#eab308';
        this.ctx.shadowBlur = 14;
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const jitter = Math.sin(time * 0.02) * 12;

        this.ctx.quadraticCurveTo(midX + jitter, midY - 15 + jitter, p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Hologram Tag floating in 3D camera space above hand
     */
    drawARHologramBadge(x, y, progress)
    {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Background Glass Box
        this.ctx.fillStyle = 'rgba(23, 18, 27, 0.88)';
        this.ctx.strokeStyle = '#ec4899';
        this.ctx.lineWidth = 1.5;
        this.ctx.shadowColor = '#ec4899';
        this.ctx.shadowBlur = 10;

        const bw = 170;
        const bh = 34;
        this.ctx.beginPath();
        this.ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 8);
        this.ctx.fill();
        this.ctx.stroke();

        // Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const percent = Math.round(Math.min(progress * 100, 100));
        this.ctx.fillText(`✌️ VICTORY AR: ${percent}%`, 0, 0);

        this.ctx.restore();
    }

    updateMeter(progress, isVictory)
    {
        if(!this.meterBar || !this.meterLabel) return;
        const p = Math.min(Math.max(progress, 0), 1.0);
        this.meterBar.style.width = `${Math.round(p * 100)}%`;

        if(isVictory)
        {
            this.meterBar.style.background = 'linear-gradient(90deg, #ec4899, #f59e0b)';
            this.meterLabel.textContent = `HOLD ✌️ TO CONFIRM (${Math.round(p * 100)}%)`;
        }
        else
        {
            this.meterBar.style.background = 'linear-gradient(90deg, #38bdf8, #818cf8)';
            if(p > 0) this.meterLabel.textContent = 'DETECTING HAND...';
            else this.meterLabel.textContent = 'SHOW ✌️ VICTORY / PEACE SIGN';
        }
    }

    confirmVictoryGesture()
    {
        this.isVictoryConfirmed = true;
        this.instructionEl.classList.add('is-hidden');
        this.feedbackCard.classList.remove('is-hidden');

        this.playSuccessArpeggio();
        this.spawnConfetti();
    }

    /* -------------------------------------------------------------
     * SPARKLES & CONFETTI PARTICLE SYSTEM
     * ------------------------------------------------------------- */
    spawnSparkle(x, y, color)
    {
        this.particles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2.5 - 1.0,
            size: Math.random() * 4 + 2,
            color: color,
            alpha: 1.0,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.02
        });
    }

    spawnConfetti()
    {
        if(!this.canvas) return;
        const colors = ['#f59e0b', '#ec4899', '#a855f7', '#38bdf8', '#10b981'];
        for(let i = 0; i < 60; i++)
        {
            this.particles.push({
                x: this.canvas.width / 2 + (Math.random() - 0.5) * 80,
                y: this.canvas.height / 2 + (Math.random() - 0.5) * 60,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 3,
                size: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1.0,
                life: 1.0,
                decay: Math.random() * 0.015 + 0.01
            });
        }
    }

    updateAndDrawParticles(delta)
    {
        for(let i = this.particles.length - 1; i >= 0; i--)
        {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if(p.life <= 0)
            {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 6;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    /* -------------------------------------------------------------
     * PROCEDURAL WEB AUDIO API SYNTHESIZER
     * ------------------------------------------------------------- */
    initAudio()
    {
        if(!this.audioCtx)
        {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if(AudioContext) this.audioCtx = new AudioContext();
        }
        if(this.audioCtx && this.audioCtx.state === 'suspended')
        {
            this.audioCtx.resume();
        }
    }

    playTone(freq, duration)
    {
        try
        {
            this.initAudio();
            if(!this.audioCtx) return;

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        }
        catch(e) {}
    }

    playSuccessArpeggio()
    {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 0.22);
            }, idx * 75);
        });
    }
}
