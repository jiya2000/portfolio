/**
 * 🖐️ DYNAMIC AR FINGER-COUNT RATING ENGINE (Vision-Based Augmented Reality)
 * -------------------------------------------------------------------------
 * Features:
 * 1. Real-Time 21-Landmark Hand Tracking (MediaPipe Hands in WASM/WebGL).
 * 2. Continuous Finger Counting (1, 2, 3, 4, 5 fingers) mapped directly to Star Ratings.
 * 3. Spatial AR Augmentation: 3D rotating golden stars anchored on EVERY extended fingertip!
 * 4. Multi-Fingertip Electric Laser Arc: Connects all active extended fingertips in video space.
 * 5. Holographic HUD Rating Tag floating above hand with live star preview.
 * 6. Temporal Dwell Lock-in (850ms): Hold steady to confirm rating with confetti & pitch-tuned audio.
 * 7. Interactive Review Modal with pre-selected stars, feedback tags, and persistence.
 */

export class ARGestureRating
{
    constructor()
    {
        this.isOpen = false;
        this.stream = null;
        this.hands = null;
        this.isModelReady = false;
        this.animationFrameId = null;

        // Dynamic Finger-Count Rating State
        this.currentFingerCount = 0; // 0 to 5
        this.lockedRating = 5;       // Final confirmed rating
        this.pendingRating = 0;      // Currently tracked rating
        this.holdTimer = 0;          // Time current rating has been held steady
        this.holdThreshold = 850;    // ms to lock in
        this.isRatingConfirmed = false;
        this.particles = [];
        this.lastFrameTime = performance.now();

        // Audio Synthesizer
        this.audioCtx = null;

        // Default Tags
        this.selectedRating = 5;
        this.selectedTags = new Set(['🌟 Outstanding 3D World', '🏎️ Realistic Physics', '🖐️ Dynamic AR Hand Tracking', '🎓 A+ Academic Project']);

        this.initDOM();
        this.initEvents();
    }

    initDOM()
    {
        // 1. Floating Trigger Button in bottom-right corner
        this.triggerBtn = document.createElement('button');
        this.triggerBtn.className = 'js-ar-rate-btn ar-gesture-trigger-pill';
        this.triggerBtn.setAttribute('title', 'Rate Portfolio with Hand Fingers (1–5 ⭐)');
        this.triggerBtn.innerHTML = `
            <div class="pill-pulse"></div>
            <span class="pill-icon">🖐️</span>
            <div class="pill-text-wrap">
                <span class="pill-tag">VISION AR</span>
                <span class="pill-title">Rate with Fingers (1–5 ⭐)</span>
            </div>
        `;
        document.body.appendChild(this.triggerBtn);

        // 2. Centered AR Scanner Modal
        this.modal = document.createElement('div');
        this.modal.className = 'js-ar-gesture-modal ar-gesture-modal is-hidden';
        this.modal.innerHTML = `
            <div class="ar-gesture-backdrop js-ar-close"></div>
            <div class="ar-gesture-dialog">
                <!-- Top Cyber Bar -->
                <div class="ar-dialog-header">
                    <div class="ar-dialog-badge">
                        <span class="ar-live-dot"></span>
                        VISION AR • FINGER-COUNT GESTURE RECOGNITION
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
                            <div class="instruction-symbol">🖐️</div>
                            <div class="instruction-title">Show 1 to 5 Fingers (1–5 ⭐)</div>
                            <div class="instruction-subtitle">The number of fingers you hold up sets your star rating in real time!</div>
                        </div>

                        <!-- Real-time Meter -->
                        <div class="js-ar-meter-wrap ar-meter-wrap">
                            <div class="ar-meter-bar js-ar-meter-bar"></div>
                            <span class="js-ar-meter-label ar-meter-label">SHOW HAND TO CAMERA...</span>
                        </div>
                    </div>

                    <!-- Interactive Rating Card (Revealed upon locking rating) -->
                    <div class="js-ar-feedback-card ar-feedback-card is-hidden">
                        <div class="feedback-badge js-confirmed-badge">✨ 5 STARS CONFIRMED VIA AR</div>
                        <h3 class="feedback-title">Rate Aditi's 3D & AR/VR Experience</h3>
                        <p class="feedback-sub">Recognized <span class="js-detected-fingers-text">5 fingers</span> via real-time spatial vision tracking.</p>

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
                            <span class="chip-tag is-selected" data-tag="🖐️ Dynamic AR Hand Tracking">🖐️ Dynamic AR Hand Tracking</span>
                            <span class="chip-tag" data-tag="🎵 Futuristic Spatial Sound">🎵 Futuristic Sound</span>
                            <span class="chip-tag is-selected" data-tag="🎓 A+ Academic Project">🎓 A+ Academic Project</span>
                        </div>

                        <textarea class="feedback-textarea js-feedback-text" placeholder="Add an optional review or comment for Aditi / professor..." rows="2"></textarea>

                        <div class="feedback-btn-row">
                            <button class="btn-submit-review js-btn-submit">Submit Rating ✨</button>
                            <button class="btn-scan-again js-btn-rescan">Change Rating (Scan Fingers Again)</button>
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
        this.confirmedBadge = this.modal.querySelector('.js-confirmed-badge');
        this.detectedFingersText = this.modal.querySelector('.js-detected-fingers-text');
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

        // Star rating manual click override
        const starBtns = this.modal.querySelectorAll('.js-stars-row .star-btn');
        starBtns.forEach(btn => {
            btn.addEventListener('click', () => {
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
        this.selectedRating = Math.max(1, Math.min(5, val));
        const starBtns = this.modal.querySelectorAll('.js-stars-row .star-btn');
        starBtns.forEach(btn => {
            const starNum = parseInt(btn.dataset.star, 10);
            if(starNum <= this.selectedRating)
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
            method: 'AR_FINGER_COUNT_GESTURE'
        };

        try
        {
            localStorage.setItem('aditi_ar_portfolio_rating', JSON.stringify(reviewData));
        }
        catch(e) {}

        this.playStarArpeggio(this.selectedRating);
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
        this.isRatingConfirmed = false;
        this.currentFingerCount = 0;
        this.pendingRating = 0;
        this.holdTimer = 0;

        this.feedbackCard.classList.add('is-hidden');
        this.feedbackSuccess.classList.add('is-hidden');

        const submitBtn = this.modal.querySelector('.js-btn-submit');
        if(submitBtn) submitBtn.style.display = '';
        const rescanBtn = this.modal.querySelector('.js-btn-rescan');
        if(rescanBtn) rescanBtn.style.display = '';

        this.instructionEl.classList.remove('is-hidden');
        this.meterLabel.textContent = 'SHOW 1 TO 5 FINGERS...';
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
            this.meterLabel.textContent = 'READY! SHOW 1 TO 5 FINGERS';

            this.lastFrameTime = performance.now();
            this.startTrackingLoop();
        }
        catch(err)
        {
            console.error('AR Camera Error:', err);
            this.meterLabel.textContent = 'CAMERA ACCESS DENIED OR UNAVAILABLE';
            alert('Camera access is required for real-time Augmented Reality hand tracking. Please allow camera access in your browser.');
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
     * Hand Landmark Processor & Multi-Finger AR Augmentation
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
            // Hand not in view
            this.holdTimer = Math.max(0, this.holdTimer - delta * 2);
            this.updateMeter(0, 0);
            return;
        }

        const landmarks = results.multiHandLandmarks[0];

        // 1. Detect which fingers are extended (Returns array of extended fingertips)
        const extendedFingers = this.detectExtendedFingers(landmarks, w, h);
        const count = extendedFingers.length; // 0 to 5

        // 2. Render Cyber Hand Skeleton in Video Space
        const isTrackingActive = count > 0;
        this.drawCyberSkeleton(landmarks, w, h, isTrackingActive);

        if(count > 0 && count <= 5)
        {
            // 3. SPATIAL AR AUGMENTATION: Render a 3D rotating golden star on EVERY extended fingertip!
            const colors = ['#f59e0b', '#fbbf24', '#ec4899', '#a855f7', '#38bdf8'];
            extendedFingers.forEach((finger, idx) => {
                this.drawARStar(finger.x, finger.y, now + idx * 800, colors[idx % colors.length], '#fbbf24');

                // Emit floating sparkles from each extended fingertip into real-world camera space
                if(Math.random() < 0.3)
                {
                    this.spawnSparkle(finger.x, finger.y, colors[idx % colors.length]);
                }
            });

            // 4. Draw electric energy laser beams connecting all active fingertips
            if(extendedFingers.length >= 2)
            {
                this.drawMultiFingerLaser(extendedFingers, now);
            }

            // 5. Draw Floating AR Holographic Star Rating Badge above hand
            const avgX = extendedFingers.reduce((sum, f) => sum + f.x, 0) / extendedFingers.length;
            const minY = Math.min(...extendedFingers.map(f => f.y)) - 48;
            this.drawARRatingBadge(avgX, minY, count);

            // 6. Temporal Dwell Lock-in Logic
            if(count === this.pendingRating)
            {
                this.holdTimer += delta;
            }
            else
            {
                // User changed finger count (e.g. from 3 fingers to 5 fingers)
                this.pendingRating = count;
                this.holdTimer = 0;
                this.playTone(320 + count * 90, 0.08); // Interactive audio cue per finger count
            }

            const progress = Math.min(this.holdTimer / this.holdThreshold, 1.0);
            this.updateMeter(progress, count);

            if(!this.isRatingConfirmed && this.holdTimer >= this.holdThreshold)
            {
                this.confirmRating(count);
            }
        }
        else
        {
            this.holdTimer = Math.max(0, this.holdTimer - delta * 2);
            this.updateMeter(0, 0);
        }
    }

    /**
     * Kinematic Finger State Detection (1 to 5 Fingers)
     */
    detectExtendedFingers(lm, w, h)
    {
        const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        const extended = [];

        // Helper: Convert normalized landmark to screen coords (mirrored horizontal)
        const toScreen = (idx) => ({
            x: (1.0 - lm[idx].x) * w,
            y: lm[idx].y * h,
            tipIdx: idx
        });

        // 1. Thumb (Landmark 4 tip, 2 mcp, 17 pinky base)
        const thumbTipToPinky = dist(lm[4], lm[17]);
        const thumbMcpToPinky = dist(lm[2], lm[17]);
        const thumbTipToWrist = dist(lm[4], lm[0]);
        const thumbIpToWrist = dist(lm[3], lm[0]);
        const isThumbExtended = (thumbTipToPinky > thumbMcpToPinky * 1.18) && (thumbTipToWrist > thumbIpToWrist * 1.05);

        // 2. Index (Landmark 8 tip, 6 pip, 5 mcp)
        const isIndexExtended = dist(lm[8], lm[0]) > dist(lm[6], lm[0]) * 1.12 && lm[8].y < lm[6].y;

        // 3. Middle (Landmark 12 tip, 10 pip, 9 mcp)
        const isMiddleExtended = dist(lm[12], lm[0]) > dist(lm[10], lm[0]) * 1.12 && lm[12].y < lm[10].y;

        // 4. Ring (Landmark 16 tip, 14 pip, 13 mcp)
        const isRingExtended = dist(lm[16], lm[0]) > dist(lm[14], lm[0]) * 1.12 && lm[16].y < lm[14].y;

        // 5. Pinky (Landmark 20 tip, 18 pip, 17 mcp)
        const isPinkyExtended = dist(lm[20], lm[0]) > dist(lm[18], lm[0]) * 1.12 && lm[20].y < lm[18].y;

        // Order fingers naturally from Thumb to Pinky
        if(isThumbExtended) extended.push(toScreen(4));
        if(isIndexExtended) extended.push(toScreen(8));
        if(isMiddleExtended) extended.push(toScreen(12));
        if(isRingExtended) extended.push(toScreen(16));
        if(isPinkyExtended) extended.push(toScreen(20));

        return extended;
    }

    /**
     * AR Skeleton Renderer with Neon Glow
     */
    drawCyberSkeleton(landmarks, w, h, isTrackingActive)
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
        this.ctx.lineWidth = isTrackingActive ? 2.5 : 1.5;
        this.ctx.strokeStyle = isTrackingActive ? 'rgba(236, 72, 153, 0.8)' : 'rgba(56, 189, 248, 0.45)';
        this.ctx.shadowBlur = isTrackingActive ? 10 : 4;
        this.ctx.shadowColor = isTrackingActive ? '#ec4899' : '#38bdf8';

        connections.forEach(([i, j]) => {
            const p1 = { x: (1.0 - landmarks[i].x) * w, y: landmarks[i].y * h };
            const p2 = { x: (1.0 - landmarks[j].x) * w, y: landmarks[j].y * h };

            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        });

        // Joint nodes
        landmarks.forEach((lm, idx) => {
            const x = (1.0 - lm.x) * w;
            const y = lm.y * h;
            const isTip = (idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20);

            this.ctx.beginPath();
            this.ctx.arc(x, y, isTip ? 5 : 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = isTip ? '#fbbf24' : '#ffffff';
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    /**
     * Spatially Anchored 3D Rotating Star on Fingertip
     */
    drawARStar(cx, cy, time, colorInner, colorOuter)
    {
        const spikes = 5;
        const outerRadius = 18 + Math.sin(time * 0.008) * 3;
        const innerRadius = 8;
        const rotation = time * 0.003;

        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(rotation);

        // Radial Energy Aura
        const aura = this.ctx.createRadialGradient(0, 0, 2, 0, 0, outerRadius * 1.6);
        aura.addColorStop(0, colorInner);
        aura.addColorStop(0.5, colorOuter);
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = aura;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, outerRadius * 1.6, 0, Math.PI * 2);
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
        this.ctx.shadowBlur = 16;
        this.ctx.fill();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Laser Beam connecting all extended fingertips
     */
    drawMultiFingerLaser(fingers, time)
    {
        this.ctx.save();
        this.ctx.strokeStyle = '#fef08a';
        this.ctx.shadowColor = '#eab308';
        this.ctx.shadowBlur = 14;
        this.ctx.lineWidth = 2.5;

        for(let i = 0; i < fingers.length - 1; i++)
        {
            const p1 = fingers[i];
            const p2 = fingers[i + 1];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const jitter = Math.sin(time * 0.02 + i) * 8;

            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.quadraticCurveTo(midX + jitter, midY - 12 + jitter, p2.x, p2.y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    /**
     * Floating AR Rating Badge in Camera Space above hand
     */
    drawARRatingBadge(x, y, count)
    {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Background Glass Box
        this.ctx.fillStyle = 'rgba(23, 18, 27, 0.9)';
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#f59e0b';
        this.ctx.shadowBlur = 12;

        const starsStr = '⭐'.repeat(count);
        const text = `${starsStr} (${count} STAR${count > 1 ? 'S' : ''})`;

        const bw = Math.max(180, count * 36 + 40);
        const bh = 36;
        this.ctx.beginPath();
        this.ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 10);
        this.ctx.fill();
        this.ctx.stroke();

        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 13px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, 0, 0);

        this.ctx.restore();
    }

    updateMeter(progress, count)
    {
        if(!this.meterBar || !this.meterLabel) return;
        const p = Math.min(Math.max(progress, 0), 1.0);
        this.meterBar.style.width = `${Math.round(p * 100)}%`;

        if(count > 0)
        {
            const starsStr = '⭐'.repeat(count);
            this.meterBar.style.background = 'linear-gradient(90deg, #f59e0b, #ec4899)';
            this.meterLabel.textContent = `HOLD TO CONFIRM ${starsStr} ${count} STAR${count > 1 ? 'S' : ''} (${Math.round(p * 100)}%)`;
        }
        else
        {
            this.meterBar.style.background = 'linear-gradient(90deg, #38bdf8, #818cf8)';
            this.meterLabel.textContent = 'SHOW 1 TO 5 FINGERS TO RATE...';
        }
    }

    confirmRating(count)
    {
        this.isRatingConfirmed = true;
        this.lockedRating = count;
        this.setRating(count);

        if(this.confirmedBadge)
        {
            this.confirmedBadge.textContent = `✨ ${count} STAR${count > 1 ? 'S' : ''} CONFIRMED VIA AR`;
        }
        if(this.detectedFingersText)
        {
            this.detectedFingersText.textContent = `${count} finger${count > 1 ? 's' : ''}`;
        }

        this.instructionEl.classList.add('is-hidden');
        this.feedbackCard.classList.remove('is-hidden');

        this.playStarArpeggio(count);
        this.spawnConfetti();
    }

    /* -------------------------------------------------------------
     * SPARKLES & CONFETTI PARTICLE SYSTEM
     * ------------------------------------------------------------- */
    spawnSparkle(x, y, color)
    {
        this.particles.push({
            x: x + (Math.random() - 0.5) * 12,
            y: y + (Math.random() - 0.5) * 12,
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
        for(let i = 0; i < 70; i++)
        {
            this.particles.push({
                x: this.canvas.width / 2 + (Math.random() - 0.5) * 100,
                y: this.canvas.height / 2 + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 9,
                vy: (Math.random() - 0.5) * 9 - 3,
                size: Math.random() * 7 + 3,
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

    playStarArpeggio(starsCount)
    {
        const scale = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C5, D5, E5, G5, C6
        const notesToPlay = scale.slice(0, starsCount);

        notesToPlay.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 0.22);
            }, idx * 75);
        });
    }
}
