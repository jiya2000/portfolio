/**
 * 🖐️ AR HAND-DRIVE TELEOPERATION CONTROLLER (Cross-Reality Spatial Interaction)
 * ------------------------------------------------------------------------------
 * Academic Framework:
 * 1. Vision-Based Natural User Interface (NUI): Markerless Hand Teleoperation
 * 2. Cross-Reality (XR) Coupling: Optical Camera Tracking -> Rapier3D Vehicle Physics
 * 3. Spatial Deadzone & Analog Velocity Mapping: Linear Vector & Radial Deadzone
 * 4. Augmented Reality Flight-HUD: Superimposes dynamic 3D directional vectors,
 *    steering angle indicators, and velocity vectors directly onto physical hand in camera feed.
 */

export class ARHandController
{
    constructor()
    {
        this.active = false;
        this.stream = null;
        this.hands = null;
        this.isModelReady = false;
        this.animationFrameId = null;

        // Vehicle Control Telemetry
        this.accelerating = 0; // -1 (reverse) to +1 (forward)
        this.steering = 0;     // -1 (right) to +1 (left)
        this.boosting = 0;     // 0 or 1
        this.braking = 0;      // 0 or 1

        // Normalized Deadzone Configuration
        this.center = { x: 0.5, y: 0.5 };
        this.deadzoneRadius = 0.08; // 8% of screen center is neutral resting
        this.currentHand = null;

        // Audio cues
        this.audioCtx = null;
        this.lastToneTime = 0;

        this.initDOM();
        this.initEvents();
    }

    initDOM()
    {
        // 1. Floating Trigger Button (Bottom-Right Dock)
        this.triggerBtn = document.createElement('button');
        this.triggerBtn.className = 'js-ar-hand-btn ar-hand-trigger-pill';
        this.triggerBtn.setAttribute('title', 'Control 3D Character/Car with Hand Gestures (AR Teleoperation)');
        this.triggerBtn.innerHTML = `
            <div class="pill-pulse-cyan"></div>
            <span class="pill-icon">🖐️</span>
            <div class="pill-text-wrap">
                <span class="pill-tag cyan">SPATIAL NUI</span>
                <span class="pill-title">AR Hand Drive</span>
            </div>
        `;
        document.body.appendChild(this.triggerBtn);

        // 2. Picture-in-Picture AR Cockpit Viewport (Bottom-Left by default)
        this.hud = document.createElement('div');
        this.hud.className = 'js-ar-hand-hud ar-hand-hud is-hidden';
        this.hud.innerHTML = `
            <div class="hud-top-bar">
                <div class="hud-status">
                    <span class="hud-live-beacon"></span>
                    AR TELEOP • HAND DRIVE
                </div>
                <div class="hud-top-actions">
                    <button class="hud-action-btn js-ar-locate" title="Center camera on girl">🎯 Locate</button>
                    <button class="hud-action-btn js-ar-respawn" title="Respawn girl to plaza if stuck">🔄 Respawn</button>
                    <button class="hud-close-btn js-ar-hand-close" title="Stop AR Hand Drive">✕</button>
                </div>
            </div>


            <div class="hud-viewport">
                <video class="js-hand-webcam hand-webcam" playsinline muted autoplay></video>
                <canvas class="js-hand-canvas hand-canvas"></canvas>

                <!-- Cockpit HUD Overlay -->
                <div class="hud-bracket-tl"></div>
                <div class="hud-bracket-tr"></div>
                <div class="hud-bracket-bl"></div>
                <div class="hud-bracket-br"></div>

                <!-- Center Crosshair & Deadzone Ring -->
                <div class="hud-neutral-circle"></div>

                <!-- Telemetry Readout -->
                <div class="hud-telemetry-bar">
                    <span class="js-telem-drive telem-pill">IDLE (CENTER)</span>
                    <span class="js-telem-steer telem-pill">STEER: 0°</span>
                </div>
            </div>

            <div class="hud-hints">
                <span>Move hand: <strong>UP</strong> ⬆ Fwd • <strong>DOWN</strong> ⬇ Rev • <strong>LEFT/RIGHT</strong> ⬅➡ Steer</span>
            </div>
        `;
        document.body.appendChild(this.hud);

        // DOM references
        this.video = this.hud.querySelector('.js-hand-webcam');
        this.canvas = this.hud.querySelector('.js-hand-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.telemDrive = this.hud.querySelector('.js-telem-drive');
        this.telemSteer = this.hud.querySelector('.js-telem-steer');
    }

    initEvents()
    {
        // Toggle HUD on button click
        this.triggerBtn.addEventListener('click', () => {
            if(this.active) this.stop();
            else this.start();
        });

        // Locate button
        const locateBtn = this.hud.querySelector('.js-ar-locate');
        if(locateBtn)
        {
            locateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.recenterCamera();
                this.playTone(659.25, 0.1);
            });
        }

        // Respawn button
        const respawnBtn = this.hud.querySelector('.js-ar-respawn');
        if(respawnBtn)
        {
            respawnBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.respawnPlayer();
                this.playTone(440, 0.15);
            });
        }

        // Close button
        const closeBtn = this.hud.querySelector('.js-ar-hand-close');
        if(closeBtn)
        {
            closeBtn.addEventListener('click', () => {
                this.stop();
            });
        }
    }

    recenterCamera()
    {
        const game = window.game;
        if(game && game.player && game.view && game.view.focusPoint)
        {
            game.view.focusPoint.isTracking = true;
            game.view.focusPoint.position.x = game.player.position.x;
            game.view.focusPoint.position.z = game.player.position.z;
            game.view.focusPoint.smoothedPosition.x = game.player.position.x;
            game.view.focusPoint.smoothedPosition.z = game.player.position.z;
        }
    }

    respawnPlayer()
    {
        const game = window.game;
        if(game && game.player)
        {
            game.player.respawn(null, () => {
                this.recenterCamera();
            });
            this.recenterCamera();
        }
    }


    async start()
    {
        if(this.active) return;
        this.active = true;
        this.triggerBtn.classList.add('is-active');
        this.hud.classList.remove('is-hidden');

        // Immediately lock and recenter camera on player
        this.recenterCamera();


        try
        {
            this.telemDrive.textContent = 'CONNECTING CAM...';
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 480 },
                    height: { ideal: 360 },
                    facingMode: 'user'
                },
                audio: false
            });
            this.video.srcObject = this.stream;
            await this.video.play();

            this.canvas.width = this.video.videoWidth || 480;
            this.canvas.height = this.video.videoHeight || 360;

            this.telemDrive.textContent = 'LOADING MODEL...';
            await this.loadMediaPipeHands();
            this.telemDrive.textContent = 'NEUTRAL (READY)';

            this.startTrackingLoop();
            this.playTone(587.33, 0.15); // Audio confirmation
        }
        catch(err)
        {
            console.error('AR Hand Controller Error:', err);
            this.telemDrive.textContent = 'CAM ERROR';
            alert('Camera access is required for real-time AR Hand Drive. Please allow camera permissions in your browser.');
            this.stop();
        }
    }

    stop()
    {
        this.active = false;
        this.triggerBtn.classList.remove('is-active');
        this.hud.classList.add('is-hidden');

        // Reset control values
        this.accelerating = 0;
        this.steering = 0;
        this.boosting = 0;
        this.braking = 0;

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

        if(this.ctx)
        {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    async loadMediaPipeHands()
    {
        if(this.isModelReady && this.hands) return;

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
            if(!this.active) return;

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
     * Hand Kinematics & Spatial Teleoperation Vector Computation
     */
    onHandResults(results)
    {
        if(!this.ctx || !this.canvas) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        const centerX = w / 2;
        const centerY = h / 2;
        const deadzonePx = this.deadzoneRadius * Math.min(w, h);

        // 1. Draw Cockpit Deadzone Ring in Camera Center
        this.drawDeadzoneHUD(centerX, centerY, deadzonePx);

        if(!results.multiHandLandmarks || results.multiHandLandmarks.length === 0)
        {
            // Hand not detected: smoothly decay controls to zero
            this.accelerating *= 0.8;
            this.steering *= 0.8;
            this.boosting = 0;
            this.braking = 0;
            this.updateTelemetry(0, 0, false, false);
            return;
        }

        const landmarks = results.multiHandLandmarks[0];

        // 2. Compute Palm Center Coordinate (averaged over wrist 0, index MCP 5, middle MCP 9, pinky MCP 17)
        // Camera is mirrored horizontally (`scaleX(-1)`), so (1 - x) aligns with screen perspective
        const palm = {
            x: ((1.0 - (landmarks[0].x + landmarks[5].x + landmarks[9].x + landmarks[17].x) / 4)) * w,
            y: ((landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[17].y) / 4) * h
        };

        // 3. Draw Cyber Skeleton
        this.drawHandSkeleton(landmarks, w, h);

        // 4. Calculate Vector Offset from Center Deadzone
        const dx = palm.x - centerX;
        const dy = palm.y - centerY;
        const distFromCenter = Math.hypot(dx, dy);

        // Check if all 5 fingers are extended (Open Palm Boost 🖐️)
        const isBoost = this.checkAllFingersExtended(landmarks);
        const isFist = this.checkFist(landmarks);

        if(isFist)
        {
            // Fist = Emergency Hand Brake
            this.accelerating = 0;
            this.steering = 0;
            this.boosting = 0;
            this.braking = 1;
            this.drawFistBrakeHUD(palm.x, palm.y);
            this.updateTelemetry(0, 0, false, true);
            return;
        }

        this.braking = 0;

        if(distFromCenter < deadzonePx)
        {
            // Inside Neutral Deadzone: Coasting / Idle
            this.accelerating = 0;
            this.steering = 0;
            this.boosting = 0;

            this.drawNeutralPalmCursor(palm.x, palm.y);
            this.updateTelemetry(0, 0, false, false);
        }
        else
        {
            // Outside Deadzone: Active Teleoperation Driving!
            const normX = dx / (w * 0.4);
            const normY = dy / (h * 0.4);

            // Forward (moving hand UP means dy < 0) / Backward (dy > 0)
            if(dy < -deadzonePx * 0.7)
            {
                // Accelerating Forward
                const rawFwd = Math.min(1.0, (-dy - deadzonePx * 0.7) / (h * 0.32));
                this.accelerating = rawFwd;
            }
            else if(dy > deadzonePx * 0.7)
            {
                // Reversing / Backing Up
                const rawRev = Math.min(1.0, (dy - deadzonePx * 0.7) / (h * 0.3));
                this.accelerating = -rawRev;
            }
            else
            {
                this.accelerating = 0;
            }

            // Steering Left (dx < 0) / Right (dx > 0)
            // Note: In Three.js vehicle physics, positive steering turns LEFT, negative turns RIGHT
            if(Math.abs(dx) > deadzonePx * 0.6)
            {
                const steerMagnitude = Math.min(1.0, (Math.abs(dx) - deadzonePx * 0.6) / (w * 0.28));
                this.steering = dx < 0 ? steerMagnitude : -steerMagnitude;
            }
            else
            {
                this.steering = 0;
            }

            this.boosting = isBoost ? 1 : 0;

            // 5. SPATIAL AR AUGMENTATION: Render dynamic 3D directional vector from center to palm!
            this.drawDirectionalVector(centerX, centerY, palm.x, palm.y, this.accelerating, this.steering, isBoost);
            this.updateTelemetry(this.accelerating, this.steering, isBoost, false);
        }
    }

    /**
     * Check if all 5 fingers are spread wide for Nitro Boost 🖐️
     */
    checkAllFingersExtended(lm)
    {
        const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        const indexExt = dist(lm[8], lm[0]) > dist(lm[6], lm[0]) * 1.15;
        const midExt = dist(lm[12], lm[0]) > dist(lm[10], lm[0]) * 1.15;
        const ringExt = dist(lm[16], lm[0]) > dist(lm[14], lm[0]) * 1.15;
        const pinkyExt = dist(lm[20], lm[0]) > dist(lm[18], lm[0]) * 1.15;
        const thumbExt = dist(lm[4], lm[17]) > dist(lm[2], lm[17]) * 1.2;
        return indexExt && midExt && ringExt && pinkyExt && thumbExt;
    }

    /**
     * Check if fingers are closed into a fist for Handbrake ✊
     */
    checkFist(lm)
    {
        const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        const indexCurled = dist(lm[8], lm[0]) < dist(lm[6], lm[0]) * 1.05;
        const midCurled = dist(lm[12], lm[0]) < dist(lm[10], lm[0]) * 1.05;
        const ringCurled = dist(lm[16], lm[0]) < dist(lm[14], lm[0]) * 1.05;
        const pinkyCurled = dist(lm[20], lm[0]) < dist(lm[18], lm[0]) * 1.05;
        return indexCurled && midCurled && ringCurled && pinkyCurled;
    }

    /**
     * Draw Deadzone Flight-HUD Circle
     */
    drawDeadzoneHUD(cx, cy, r)
    {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 4]);

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // Center crosshair
        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(cx - 10, cy);
        this.ctx.lineTo(cx + 10, cy);
        this.ctx.moveTo(cx, cy - 10);
        this.ctx.lineTo(cx, cy + 10);
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Draw Hand Skeleton
     */
    drawHandSkeleton(landmarks, w, h)
    {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [5, 9], [9, 10], [10, 11], [11, 12],
            [9, 13], [13, 14], [14, 15], [15, 16],
            [13, 17], [17, 18], [18, 19], [19, 20],
            [0, 17]
        ];

        this.ctx.save();
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';

        connections.forEach(([i, j]) => {
            const p1 = { x: (1.0 - landmarks[i].x) * w, y: landmarks[i].y * h };
            const p2 = { x: (1.0 - landmarks[j].x) * w, y: landmarks[j].y * h };
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        });

        landmarks.forEach((lm) => {
            const x = (1.0 - lm.x) * w;
            const y = lm.y * h;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    drawNeutralPalmCursor(x, y)
    {
        this.ctx.save();
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.shadowColor = '#38bdf8';
        this.ctx.shadowBlur = 10;
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.arc(x, y, 14, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawFistBrakeHUD(x, y)
    {
        this.ctx.save();
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 14;
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.arc(x, y, 22, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 11px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('BRAKE ✊', x, y - 28);
        this.ctx.restore();
    }

    /**
     * Dynamic Holographic 3D Directional Vector Arrow
     */
    drawDirectionalVector(fromX, fromY, toX, toY, accel, steer, isBoost)
    {
        this.ctx.save();

        let color = '#38bdf8'; // Default cyan
        if(isBoost) color = '#ec4899'; // Boost magenta
        else if(accel > 0.2) color = '#10b981'; // Green accelerating
        else if(accel < -0.2) color = '#ef4444'; // Red reversing
        else if(Math.abs(steer) > 0.2) color = '#f59e0b'; // Amber steering

        this.ctx.strokeStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 12;
        this.ctx.lineWidth = isBoost ? 4 : 2.5;

        // Laser beam connecting center to palm
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();

        // Animated Arrow Head at Palm
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLen = isBoost ? 18 : 14;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fill();

        // Rotating compass ring around palm
        this.ctx.beginPath();
        this.ctx.arc(toX, toY, isBoost ? 22 : 16, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
    }

    updateTelemetry(accel, steer, isBoost, isBrake)
    {
        if(!this.telemDrive || !this.telemSteer) return;

        if(isBrake)
        {
            this.telemDrive.textContent = '⛔ HANDBRAKE (FIST)';
            this.telemDrive.style.color = '#ef4444';
            this.telemSteer.textContent = 'STEER: LOCKED';
            return;
        }

        if(isBoost)
        {
            this.telemDrive.textContent = '⚡ NITRO BOOST (100%)';
            this.telemDrive.style.color = '#f472b6';
        }
        else if(accel > 0.05)
        {
            this.telemDrive.textContent = `⬆ FORWARD (${Math.round(accel * 100)}%)`;
            this.telemDrive.style.color = '#34d399';
        }
        else if(accel < -0.05)
        {
            this.telemDrive.textContent = `⬇ REVERSE (${Math.round(Math.abs(accel) * 100)}%)`;
            this.telemDrive.style.color = '#f87171';
        }
        else
        {
            this.telemDrive.textContent = '⚪ IDLE (DEADZONE)';
            this.telemDrive.style.color = '#38bdf8';
        }

        if(Math.abs(steer) > 0.05)
        {
            const dir = steer > 0 ? 'LEFT ⬅' : 'RIGHT ➡';
            this.telemSteer.textContent = `${dir} (${Math.round(Math.abs(steer) * 45)}°)`;
        }
        else
        {
            this.telemSteer.textContent = 'STEER: 0°';
        }
    }

    playTone(freq, duration)
    {
        try
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
            if(!this.audioCtx) return;

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        }
        catch(e) {}
    }
}
