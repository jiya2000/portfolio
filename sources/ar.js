import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class RealWorldAR
{
    constructor()
    {
        this.video = document.querySelector('#ar-camera-feed');
        this.canvas = document.querySelector('#ar-canvas');
        this.permissionBanner = document.querySelector('#ar-permission-banner');
        this.speechBubble = document.querySelector('#ar-speech');
        this.statusText = document.querySelector('#ar-status-text');
        this.shutterFlash = document.querySelector('#shutter-flash');
        this.holoModal = document.querySelector('#holo-modal');

        this.facingMode = 'environment';
        this.stream = null;

        // Projects Data
        this.projects = [
            {
                title: 'MalGuard',
                tag: 'ML SECURITY ENGINE',
                desc: 'Machine learning-driven Windows PE malware classifier detecting malicious payloads and zero-day threats in real time.',
                tags: ['Python', 'XGBoost', 'LIEF', 'PE Analysis', 'FastAPI'],
                link: 'https://github.com/jiya2000'
            },
            {
                title: '3D Arcade Portfolio',
                tag: 'WEBGPU / THREE.JS',
                desc: 'An immersive arcade physics world featuring custom shaders, drivable vehicles, and cross-platform Augmented Reality.',
                tags: ['Three.js', 'TSL', 'WebGPU', 'Rapier Physics', 'GLSL'],
                link: 'https://github.com/jiya2000/portfolio'
            },
            {
                title: 'NetSec & AppSec Suite',
                tag: 'SECURITY RESEARCH',
                desc: 'Automated network penetration testing toolkit, OWASP Top 10 auditing utilities, and secure authentication architectures.',
                tags: ['Cybersecurity', 'Burp Suite', 'Cryptography', 'Audit'],
                link: 'https://github.com/jiya2000'
            }
        ];

        this.initThree();
        this.initCamera();
        this.initListeners();
        this.initTouchControls();
        this.initDeviceOrientation();
    }

    /* -------------------------------------------------------------
     * CAMERA STREAM (Live Phone Real-World View)
     * ------------------------------------------------------------- */
    async initCamera()
    {
        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        {
            if(this.statusText)
                this.statusText.textContent = 'CAMERA SIMULATION (DESKTOP)';
            if(this.permissionBanner)
                this.permissionBanner.classList.add('is-hidden');
            return;
        }

        try
        {
            if(this.stream)
            {
                this.stream.getTracks().forEach(t => t.stop());
            }

            const constraints = {
                video: {
                    facingMode: { ideal: this.facingMode },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            await this.video.play();

            if(this.facingMode === 'user')
                this.video.classList.add('is-front');
            else
                this.video.classList.remove('is-front');

            if(this.permissionBanner)
                this.permissionBanner.classList.add('is-hidden');
            if(this.statusText)
                this.statusText.textContent = 'AR: LIVE ROOM CAMERA';
        }
        catch(err)
        {
            console.warn('Camera access error:', err);
            if(this.statusText)
                this.statusText.textContent = 'CAMERA BLOCKED (TAP TO ENABLE)';
            if(this.permissionBanner)
                this.permissionBanner.classList.remove('is-hidden');
        }
    }

    flipCamera()
    {
        this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
        this.initCamera();
    }

    /* -------------------------------------------------------------
     * THREE.JS TRANSPARENT OVERLAY SCENE
     * ------------------------------------------------------------- */
    initThree()
    {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        // Position camera as if holding a phone pointing slightly down at floor/desk
        this.camera.position.set(0, 1.35, 3.2);
        this.camera.lookAt(0, 0.65, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 1.6);
        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xfff5ea, 2.2);
        sun.position.set(2, 4, 3);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        this.scene.add(sun);

        const rimLight = new THREE.DirectionalLight(0xe11d48, 1.2);
        rimLight.position.set(-3, 2, -2);
        this.scene.add(rimLight);

        // Root group for the entire AR anchor (character + pedestal + project orbs)
        this.anchor = new THREE.Group();
        this.anchor.position.set(0, 0, 0);
        this.scene.add(this.anchor);

        this.buildPedestal();
        this.buildProjectOrbs();
        this.buildParticles();
        this.loadCharacter();

        window.addEventListener('resize', () => this.onResize());

        this.clock = new THREE.Clock();
        this.animate();
    }

    buildPedestal()
    {
        this.pedestalGroup = new THREE.Group();
        this.anchor.add(this.pedestalGroup);

        // Real-world soft shadow disc
        const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = 128;
        shadowCanvas.height = 128;
        const sctx = shadowCanvas.getContext('2d');
        const grad = sctx.createRadialGradient(64, 64, 10, 64, 64, 60);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, 128, 128);
        const shadowTex = new THREE.CanvasTexture(shadowCanvas);

        const shadowMat = new THREE.MeshBasicMaterial({
            map: shadowTex,
            transparent: true,
            depthWrite: false
        });
        const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = 0.005;
        this.pedestalGroup.add(shadowPlane);

        // Outer crimson glowing cyber ring
        const ringGeo = new THREE.TorusGeometry(0.58, 0.016, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0x9f1239,
            roughness: 0.2,
            metalness: 0.8
        });
        this.outerRing = new THREE.Mesh(ringGeo, ringMat);
        this.outerRing.rotation.x = Math.PI / 2;
        this.outerRing.position.y = 0.02;
        this.pedestalGroup.add(this.outerRing);

        // Inner glowing cyan energy ring
        const innerRingGeo = new THREE.TorusGeometry(0.42, 0.01, 12, 48);
        const innerRingMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            roughness: 0.3,
            metalness: 0.5
        });
        this.innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
        this.innerRing.rotation.x = Math.PI / 2;
        this.innerRing.position.y = 0.03;
        this.pedestalGroup.add(this.innerRing);

        // Pedestal base disc
        const baseGeo = new THREE.CylinderGeometry(0.50, 0.54, 0.03, 32);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x1f1424,
            roughness: 0.5,
            metalness: 0.4
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.015;
        this.pedestalGroup.add(base);
    }

    buildProjectOrbs()
    {
        this.orbs = [];
        this.orbsGroup = new THREE.Group();
        this.anchor.add(this.orbsGroup);

        const orbConfigs = [
            { name: 'MalGuard', color: 0xe11d48, icon: '🛡️', index: 0 },
            { name: 'Folio 2025', color: 0x38bdf8, icon: '⚡', index: 1 },
            { name: 'NetSec', color: 0x10b981, icon: '🌐', index: 2 }
        ];

        orbConfigs.forEach((cfg, i) => {
            const orbHolder = new THREE.Group();

            // Core sphere
            const sphereGeo = new THREE.SphereGeometry(0.09, 24, 24);
            const sphereMat = new THREE.MeshStandardMaterial({
                color: cfg.color,
                emissive: cfg.color,
                emissiveIntensity: 0.6,
                roughness: 0.2,
                metalness: 0.8
            });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.castShadow = true;
            orbHolder.add(sphere);

            // Orbiting aura ring
            const auraGeo = new THREE.TorusGeometry(0.12, 0.008, 12, 32);
            const auraMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
            const aura = new THREE.Mesh(auraGeo, auraMat);
            orbHolder.add(aura);

            orbHolder.userData = { projectIndex: cfg.index, name: cfg.name, sphere, aura, initialAngle: (i * Math.PI * 2) / 3 };
            this.orbsGroup.add(orbHolder);
            this.orbs.push(orbHolder);
        });
    }

    buildParticles()
    {
        const count = 40;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for(let i = 0; i < count; i++)
        {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 1.6;
            positions[i * 3 + 1] = Math.random() * 1.8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xff6b81,
            size: 0.025,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geo, mat);
        this.anchor.add(this.particles);
    }

    loadCharacter()
    {
        const loader = new GLTFLoader();
        loader.load('ar/aditi-avatar.glb', (gltf) => {
            this.character = gltf.scene;
            this.character.position.set(0, 0, 0);
            this.character.rotation.y = Math.PI;
            this.character.scale.set(0.75, 0.75, 0.75);
            this.anchor.add(this.character);

            // Trigger welcome jump
            this.jumpCharacter('Welcome to AR! 👋');
        }, undefined, (err) => {
            console.error('Error loading AR avatar GLB:', err);
        });
    }

    /* -------------------------------------------------------------
     * INTERACTIONS & ANIMATIONS (Pokéball toss, wave, jump)
     * ------------------------------------------------------------- */
    jumpCharacter(speechText = null)
    {
        if(!this.character) return;

        const startY = 0;
        const targetY = 0.28;
        const duration = 0.45;
        const startTime = this.clock.getElapsedTime();

        const updateJump = () => {
            const elapsed = this.clock.getElapsedTime() - startTime;
            if(elapsed < duration)
            {
                const progress = elapsed / duration;
                const sinVal = Math.sin(progress * Math.PI);
                this.character.position.y = startY + sinVal * targetY;
                this.character.rotation.y += 0.08;
                requestAnimationFrame(updateJump);
            }
            else
            {
                this.character.position.y = startY;
            }
        };
        updateJump();

        if(speechText)
        {
            this.showSpeech(speechText);
        }
    }

    tossCyberDisc()
    {
        // Animate a glowing disc from camera bottom towards Aditi's pedestal
        const discGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24);
        const discMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0xff0044,
            roughness: 0.2,
            metalness: 0.9
        });
        const disc = new THREE.Mesh(discGeo, discMat);
        disc.position.copy(this.camera.position).add(new THREE.Vector3(0, -0.4, -0.4));
        this.scene.add(disc);

        const startPos = disc.position.clone();
        const endPos = this.anchor.position.clone().add(new THREE.Vector3(0, 0.05, 0));
        const startTime = this.clock.getElapsedTime();
        const duration = 0.65;

        const animateToss = () => {
            const elapsed = this.clock.getElapsedTime() - startTime;
            if(elapsed < duration)
            {
                const p = elapsed / duration;
                disc.position.lerpVectors(startPos, endPos, p);
                disc.position.y += Math.sin(p * Math.PI) * 0.45;
                disc.rotation.x += 0.2;
                disc.rotation.y += 0.3;
                requestAnimationFrame(animateToss);
            }
            else
            {
                this.scene.remove(disc);
                this.jumpCharacter('Great catch! 🎯✨');
            }
        };
        animateToss();
    }

    showSpeech(text)
    {
        if(!this.speechBubble) return;

        this.speechBubble.textContent = text;
        this.speechBubble.classList.add('is-visible');

        this.updateSpeechPosition();

        clearTimeout(this.speechTimeout);
        this.speechTimeout = setTimeout(() => {
            this.speechBubble.classList.remove('is-visible');
        }, 3200);
    }

    updateSpeechPosition()
    {
        if(!this.speechBubble || !this.anchor) return;

        const headPos = new THREE.Vector3(0, 1.85, 0).applyMatrix4(this.anchor.matrixWorld);
        const screenPos = headPos.clone().project(this.camera);

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight - 30;

        this.speechBubble.style.left = `${x}px`;
        this.speechBubble.style.top = `${y}px`;
        this.speechBubble.style.transform = `translate(-50%, -100%)`;
    }

    /* -------------------------------------------------------------
     * SNAPSHOT PHOTO FEATURE
     * ------------------------------------------------------------- */
    takeSnapshot()
    {
        if(this.shutterFlash)
        {
            this.shutterFlash.classList.add('is-flashing');
            setTimeout(() => {
                this.shutterFlash.classList.remove('is-flashing');
            }, 180);
        }

        const width = this.canvas.width;
        const height = this.canvas.height;
        const captureCanvas = document.createElement('canvas');
        captureCanvas.width = width;
        captureCanvas.height = height;
        const ctx = captureCanvas.getContext('2d');

        // Draw camera video frame if active
        if(this.video && this.video.readyState >= 2)
        {
            const vw = this.video.videoWidth;
            const vh = this.video.videoHeight;
            // Draw object-fit: cover
            const videoRatio = vw / vh;
            const canvasRatio = width / height;
            let sx = 0, sy = 0, sw = vw, sh = vh;

            if(videoRatio > canvasRatio)
            {
                sw = vh * canvasRatio;
                sx = (vw - sw) / 2;
            }
            else
            {
                sh = vw / canvasRatio;
                sy = (vh - sh) / 2;
            }

            if(this.facingMode === 'user')
            {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(this.video, sx, sy, sw, sh, -width, 0, width, height);
                ctx.restore();
            }
            else
            {
                ctx.drawImage(this.video, sx, sy, sw, sh, 0, 0, width, height);
            }
        }
        else
        {
            ctx.fillStyle = '#170d18';
            ctx.fillRect(0, 0, width, height);
        }

        // Composite Three.js render over video
        ctx.drawImage(this.canvas, 0, 0, width, height);

        // Watermark badge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.roundRect(24, height - 60, 260, 36, 18);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px -apple-system, sans-serif';
        ctx.fillText('Aditi Sharma • Portfolio AR', 40, height - 37);

        // Trigger download / share
        const dataUrl = captureCanvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.download = `aditi-ar-photo-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();

        this.showSpeech('Saved photo to device! 📸✨');
    }

    /* -------------------------------------------------------------
     * TOUCH GESTURES (Drag to move, Pinch to scale, Rotate)
     * ------------------------------------------------------------- */
    initTouchControls()
    {
        let touches = [];
        let initialDistance = 0;
        let initialScale = 1;
        let isDragging = false;
        let lastTouchX = 0;
        let lastTouchY = 0;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.canvas.addEventListener('touchstart', (e) => {
            touches = e.touches;
            if(touches.length === 1)
            {
                isDragging = true;
                lastTouchX = touches[0].clientX;
                lastTouchY = touches[0].clientY;

                // Check click on 3D elements
                mouse.x = (touches[0].clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(touches[0].clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, this.camera);

                // Check orbs
                const orbMeshes = this.orbs.map(o => o.userData.sphere);
                const orbHits = raycaster.intersectObjects(orbMeshes);
                if(orbHits.length > 0)
                {
                    const hitOrb = this.orbs.find(o => o.userData.sphere === orbHits[0].object);
                    if(hitOrb)
                    {
                        this.openProjectModal(hitOrb.userData.projectIndex);
                        isDragging = false;
                        return;
                    }
                }

                // Check character
                if(this.character)
                {
                    const charHits = raycaster.intersectObjects(this.character.children, true);
                    if(charHits.length > 0)
                    {
                        const speechPhrases = [
                            'Hi there! Welcome! 👋',
                            'Cybersecurity & Web Specialist 🛡️',
                            'Building next-gen digital worlds! ⚡',
                            'Tap the orbs to see my projects! 🔮'
                        ];
                        const randomPhrase = speechPhrases[Math.floor(Math.random() * speechPhrases.length)];
                        this.jumpCharacter(randomPhrase);
                        isDragging = false;
                        return;
                    }
                }
            }
            else if(touches.length === 2)
            {
                isDragging = false;
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                initialDistance = Math.hypot(dx, dy);
                initialScale = this.anchor.scale.x;
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            touches = e.touches;
            if(touches.length === 1 && isDragging)
            {
                const dx = touches[0].clientX - lastTouchX;
                const dy = touches[0].clientY - lastTouchY;
                lastTouchX = touches[0].clientX;
                lastTouchY = touches[0].clientY;

                // Move anchor along floor plane (X and Z)
                this.anchor.position.x += dx * 0.0035;
                this.anchor.position.z += dy * 0.0035;
            }
            else if(touches.length === 2)
            {
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                if(initialDistance > 0)
                {
                    const scaleFactor = dist / initialDistance;
                    const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.3), 2.5);
                    this.anchor.scale.set(newScale, newScale, newScale);
                }
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            isDragging = false;
            initialDistance = 0;
        });

        // Desktop mouse fallback
        let isMouseDown = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

        this.canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;

            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);

            const orbMeshes = this.orbs.map(o => o.userData.sphere);
            const orbHits = raycaster.intersectObjects(orbMeshes);
            if(orbHits.length > 0)
            {
                const hitOrb = this.orbs.find(o => o.userData.sphere === orbHits[0].object);
                if(hitOrb)
                {
                    this.openProjectModal(hitOrb.userData.projectIndex);
                    isMouseDown = false;
                    return;
                }
            }

            if(this.character)
            {
                const charHits = raycaster.intersectObjects(this.character.children, true);
                if(charHits.length > 0)
                {
                    this.jumpCharacter('Nice to meet you! 👋');
                    isMouseDown = false;
                }
            }
        });

        window.addEventListener('mousemove', (e) => {
            if(!isMouseDown) return;
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;

            this.anchor.position.x += dx * 0.003;
            this.anchor.position.z += dy * 0.003;
        });

        window.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
    }

    /* -------------------------------------------------------------
     * GYROSCOPE (Phone Motion Tracking)
     * ------------------------------------------------------------- */
    initDeviceOrientation()
    {
        const handleOrientation = (e) => {
            if(e.gamma === null || e.beta === null) return;
            // Gamma is left-to-right tilt in [-90, 90]
            // Beta is front-to-back tilt in [-180, 180]
            const targetCamX = (e.gamma / 90) * 0.4;
            const targetCamY = 1.4 + ((e.beta - 50) / 90) * 0.3;

            this.camera.position.x += (targetCamX - this.camera.position.x) * 0.05;
            this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.anchor.position.x, this.anchor.position.y + 0.7, this.anchor.position.z);
        };

        if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function')
        {
            document.body.addEventListener('click', () => {
                DeviceOrientationEvent.requestPermission().then(res => {
                    if(res === 'granted')
                        window.addEventListener('deviceorientation', handleOrientation);
                }).catch(() => {});
            }, { once: true });
        }
        else
        {
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    /* -------------------------------------------------------------
     * UI LISTENERS & PROJECT MODAL
     * ------------------------------------------------------------- */
    initListeners()
    {
        const btnStartCam = document.querySelector('#btn-start-camera');
        if(btnStartCam)
            btnStartCam.addEventListener('click', () => this.initCamera());

        const btnFlipCam = document.querySelector('#btn-flip-cam');
        if(btnFlipCam)
            btnFlipCam.addEventListener('click', () => this.flipCamera());

        const btnPose = document.querySelector('#btn-pose');
        if(btnPose)
            btnPose.addEventListener('click', () => this.jumpCharacter('Level Up! 🌟 2500 CP'));

        const btnSnapshot = document.querySelector('#btn-snapshot');
        if(btnSnapshot)
            btnSnapshot.addEventListener('click', () => this.takeSnapshot());

        const btnToss = document.querySelector('#btn-toss');
        if(btnToss)
            btnToss.addEventListener('click', () => this.tossCyberDisc());

        const btnModalClose = document.querySelector('#btn-modal-close');
        if(btnModalClose)
            btnModalClose.addEventListener('click', () => this.closeProjectModal());

        document.querySelectorAll('.chip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.project, 10);
                this.openProjectModal(idx);
            });
        });
    }

    openProjectModal(index)
    {
        const proj = this.projects[index];
        if(!proj || !this.holoModal) return;

        document.querySelector('#modal-tag').textContent = proj.tag;
        document.querySelector('#modal-title').textContent = proj.title;
        document.querySelector('#modal-desc').textContent = proj.desc;
        document.querySelector('#modal-link').href = proj.link;

        const tagsContainer = document.querySelector('#modal-tags');
        tagsContainer.innerHTML = '';
        proj.tags.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t;
            tagsContainer.appendChild(span);
        });

        this.holoModal.classList.add('is-open');
    }

    closeProjectModal()
    {
        if(this.holoModal)
            this.holoModal.classList.remove('is-open');
    }

    onResize()
    {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /* -------------------------------------------------------------
     * MAIN ANIMATION LOOP
     * ------------------------------------------------------------- */
    animate()
    {
        requestAnimationFrame(() => this.animate());

        const elapsedTime = this.clock.getElapsedTime();

        // Rotate cyber rings
        if(this.outerRing)
            this.outerRing.rotation.z = elapsedTime * 0.4;
        if(this.innerRing)
            this.innerRing.rotation.z = -elapsedTime * 0.6;

        // Subtle idle breathing for Aditi
        if(this.character && this.character.position.y === 0)
        {
            this.character.position.y = Math.sin(elapsedTime * 2.5) * 0.012;
        }

        // Orbit project orbs around Aditi
        if(this.orbs)
        {
            const radius = 0.75;
            this.orbs.forEach((orbHolder) => {
                const angle = orbHolder.userData.initialAngle + elapsedTime * 0.45;
                orbHolder.position.x = Math.cos(angle) * radius;
                orbHolder.position.z = Math.sin(angle) * radius;
                orbHolder.position.y = 0.85 + Math.sin(elapsedTime * 2.5 + orbHolder.userData.initialAngle) * 0.08;

                orbHolder.userData.aura.rotation.x = elapsedTime * 1.5;
                orbHolder.userData.aura.rotation.y = elapsedTime * 1.2;
            });
        }

        // Float particles
        if(this.particles)
        {
            this.particles.rotation.y = elapsedTime * 0.05;
        }

        this.updateSpeechPosition();

        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new RealWorldAR();
});
