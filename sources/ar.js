import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import projectsData from './data/projects.js';

class RealWorldPortfolioAR
{
    constructor()
    {
        // DOM Elements
        this.video = document.querySelector('#ar-camera-feed');
        this.canvas = document.querySelector('#ar-canvas');
        this.permissionBanner = document.querySelector('#ar-permission-banner');
        this.speechBubble = document.querySelector('#ar-speech');
        this.statusText = document.querySelector('#ar-status-text');
        this.shutterFlash = document.querySelector('#shutter-flash');
        this.strikeBanner = document.querySelector('#strike-banner');
        this.soundBtn = document.querySelector('#btn-sound');
        this.soundIcon = document.querySelector('#sound-icon');
        
        // Modals
        this.holoModal = document.querySelector('#holo-modal');
        this.careerModal = document.querySelector('#career-modal');
        this.aboutModal = document.querySelector('#about-modal');
        this.contactModal = document.querySelector('#contact-modal');
        
        // Context Drawer Panels
        this.panelProjects = document.querySelector('#panel-projects');
        this.panelCareer = document.querySelector('#panel-career');
        this.panelArcade = document.querySelector('#panel-arcade');
        this.virtualControls = document.querySelector('#virtual-controls');
        this.projCounter = document.querySelector('#proj-counter');

        // State
        this.soundEnabled = true;
        this.facingMode = 'environment';
        this.stream = null;
        this.currentMode = 'drive'; // 'drive', 'projects', 'career', 'arcade', 'about', 'contact'
        this.currentProjectIndex = 0;
        this.projects = projectsData && projectsData.length > 0 ? projectsData : [];
        this.pinsKnocked = 0;

        // Career Milestones Data (Parity with CareerArea.js)
        this.careerMilestones = [
            {
                institution: "VIT Vellore",
                role: "Integrated M.Tech Computer Science & Engineering",
                highlight: "9.65 CGPA • Department Rank 3",
                date: "2021 – Present",
                color: 0x38bdf8,
                desc: "Pursuing dual B.Tech + M.Tech in CSE with academic excellence (Rank 3, 9.65 CGPA). Specialized in distributed systems, modern AI architectures, cryptography, and real-time computing.",
                skills: ["Distributed Systems", "Algorithms", "Machine Learning", "Computer Networks", "Cybersecurity"]
            },
            {
                institution: "HCLTech",
                role: "Software & AI Intern (Enterprise Cloud Operations)",
                highlight: "Autonomous Incident Remediation & Azure",
                date: "2024",
                color: 0xe11d48,
                desc: "Engineered multi-agent AI framework for automated Kubernetes cluster telemetry analysis, root-cause diagnosis, and incident self-healing across Microsoft Azure environments.",
                skills: ["Azure", "Kubernetes", "LangGraph", "FastAPI", "Prometheus", "Autonomous Agents"]
            },
            {
                institution: "Team Sammard (Rocketry)",
                role: "CS Senior Core Lead",
                highlight: "ISRO CanSat & Suborbital Flight Telemetry",
                date: "2023 – 2024",
                color: 0xf59e0b,
                desc: "Led ground station software engineering for suborbital rocket missions. Architected high-frequency RF telemetry parsing, real-time 3D flight orientation visualization, and fail-safe recovery logic.",
                skills: ["RF Telemetry", "PyQt5", "3D Trajectories", "Sensors / IMU", "Embedded Systems"]
            },
            {
                institution: "National Defence Academy (NDA 149)",
                role: "Officer Selection Merit List",
                highlight: "AIR 417 (Girls Rank 53)",
                date: "2022",
                color: 0x10b981,
                desc: "Cleared the highly competitive National Defence Academy entrance and 5-day SSB interview with All India Rank 417 and Girls Rank 53 among hundreds of thousands of candidates.",
                skills: ["Leadership", "High-Pressure Decision Making", "Strategic Planning", "Discipline"]
            },
            {
                institution: "VIT Student Council",
                role: "Member Secretary",
                highlight: "University Technical & Cultural Governance",
                date: "2023 – 2024",
                color: 0xa855f7,
                desc: "Elected Member Secretary representing thousands of students. Spearheaded technical hackathons, symposiums, and digital academic initiatives across the campus.",
                skills: ["Executive Management", "Event Strategy", "Public Speaking", "Cross-Team Coordination"]
            },
            {
                institution: "St. Joseph's Convent",
                role: "Senior Secondary School",
                highlight: "95.4% • School Topper",
                date: "2020",
                color: 0x06b6d4,
                desc: "Graduated as School Topper in CBSE Science & Mathematics with 95.4%, establishing a rigorous foundation in mathematics, physics, and computer science.",
                skills: ["Mathematics", "Physics", "Computer Science", "Academic Excellence"]
            }
        ];

        // Vehicle Dynamics State
        this.vehicleState = {
            pos: new THREE.Vector3(0, 0, 0.4),
            velocity: new THREE.Vector3(0, 0, 0),
            heading: 0,
            speed: 0,
            maxSpeed: 2.8,
            boost: 1.0,
            acceleration: 3.5,
            deceleration: 3.2,
            turnSpeed: 2.6,
            steerAngle: 0
        };

        // Input Controls State
        this.input = {
            forward: 0,
            turn: 0,
            boost: false,
            honk: false
        };

        this.initAudio();
        this.initThree();
        this.initCamera();
        this.initDOMListeners();
        this.initTouchControls();
        this.initDeviceOrientation();
        this.initKeyboardControls();

        const urlParams = new URLSearchParams(window.location.search);
        const initialMode = urlParams.get('mode');
        if(initialMode && ['drive', 'projects', 'career', 'arcade', 'about', 'contact'].includes(initialMode))
        {
            this.setMode(initialMode, true);
        }
    }

    /* -------------------------------------------------------------
     * AUDIO SYSTEM (Web Audio API Synthesizer)
     * ------------------------------------------------------------- */
    initAudio()
    {
        try
        {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if(AudioCtx)
            {
                this.audioCtx = new AudioCtx();
            }
        }
        catch(e)
        {
            console.warn('AudioContext not supported', e);
        }
    }

    resumeAudio()
    {
        if(this.audioCtx && this.audioCtx.state === 'suspended')
        {
            this.audioCtx.resume();
        }
    }

    playEngineRumble(speedNorm)
    {
        if(!this.soundEnabled || !this.audioCtx) return;
        // Subtle engine pitch modulation
        if(!this.engineOsc)
        {
            this.engineOsc = this.audioCtx.createOscillator();
            this.engineGain = this.audioCtx.createGain();
            this.engineOsc.type = 'sawtooth';
            this.engineOsc.frequency.setValueAtTime(65, this.audioCtx.currentTime);
            this.engineGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
            this.engineOsc.connect(this.engineGain);
            this.engineGain.connect(this.audioCtx.destination);
            this.engineOsc.start();
        }
        const freq = 65 + Math.min(speedNorm, 1.5) * 85;
        this.engineOsc.frequency.setTargetAtTime(freq, this.audioCtx.currentTime, 0.1);
        const gainVal = speedNorm > 0.05 ? 0.035 : 0.008;
        this.engineGain.gain.setTargetAtTime(gainVal, this.audioCtx.currentTime, 0.1);
    }

    playHonk()
    {
        if(!this.soundEnabled || !this.audioCtx) return;
        this.resumeAudio();
        const now = this.audioCtx.currentTime;
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(392, now); // G4
        osc2.frequency.setValueAtTime(440, now); // A4

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);

        this.showSpeech('BEEP BEEP! 🚗💨');
    }

    playPinHit()
    {
        if(!this.soundEnabled || !this.audioCtx) return;
        this.resumeAudio();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(260 + Math.random() * 120, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    playStrikeChime()
    {
        if(!this.soundEnabled || !this.audioCtx) return;
        this.resumeAudio();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const now = this.audioCtx.currentTime + i * 0.08;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        });
    }

    playTone(freq = 440, duration = 0.15)
    {
        if(!this.soundEnabled || !this.audioCtx) return;
        this.resumeAudio();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration);
    }

    /* -------------------------------------------------------------
     * CAMERA STREAM (Live Phone Real-World View)
     * ------------------------------------------------------------- */
    async initCamera()
    {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('skipcam') === '1' || urlParams.get('demo') === '1')
        {
            if(this.statusText)
                this.statusText.textContent = 'AR: 3D WORLD SIMULATION';
            if(this.permissionBanner)
                this.permissionBanner.classList.add('is-hidden');
            return;
        }

        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        {
            if(this.statusText)
                this.statusText.textContent = 'AR: DESKTOP SIMULATION';
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
                this.statusText.textContent = 'AR: REAL-WORLD CAMERA • ACTIVE';
        }
        catch(err)
        {
            console.warn('Camera access fallback:', err);
            if(err.name === 'NotAllowedError' && this.permissionBanner)
            {
                if(this.statusText)
                    this.statusText.textContent = 'CAMERA BLOCKED (CLICK TO ENABLE)';
                this.permissionBanner.classList.remove('is-hidden');
            }
            else
            {
                if(this.statusText)
                    this.statusText.textContent = 'AR: 3D WORLD SIMULATION';
            }
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
        this.camera.position.set(0, 1.75, 3.4);
        this.camera.lookAt(0, 0.5, 0);

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
        const ambient = new THREE.AmbientLight(0xffffff, 1.8);
        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xfff7ed, 2.4);
        sun.position.set(3, 5, 4);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        this.scene.add(sun);

        const rim = new THREE.DirectionalLight(0xe11d48, 1.2);
        rim.position.set(-3, 2, -3);
        this.scene.add(rim);

        // Root Anchor for the entire AR world (Moves, Pinch-scales, Rotates on user room floor)
        this.anchor = new THREE.Group();
        this.anchor.position.set(0, 0, 0);
        this.scene.add(this.anchor);

        // Subsystems
        this.buildGroundShadowDisc();
        this.buildDrivableCyberCar();
        this.build3DProjectsBillboard();
        this.build3DCareerStones();
        this.buildArcadeBowlingAlley();
        this.buildCyberGridFloor();
        this.loadCharacter();

        window.addEventListener('resize', () => this.onResize());

        this.clock = new THREE.Clock();
        this.animate();
    }

    /* -------------------------------------------------------------
     * REAL-WORLD GROUND CONTACT SHADOW & CYBER GRID
     * ------------------------------------------------------------- */
    buildGroundShadowDisc()
    {
        const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = 256;
        shadowCanvas.height = 256;
        const sctx = shadowCanvas.getContext('2d');
        const grad = sctx.createRadialGradient(128, 128, 20, 128, 128, 124);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.28)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, 256, 256);
        const shadowTex = new THREE.CanvasTexture(shadowCanvas);

        const shadowMat = new THREE.MeshBasicMaterial({
            map: shadowTex,
            transparent: true,
            depthWrite: false
        });
        const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = 0.002;
        this.anchor.add(shadowPlane);
    }

    buildCyberGridFloor()
    {
        // Concentric glowing circular cyber rings on the floor
        this.ringsGroup = new THREE.Group();
        this.anchor.add(this.ringsGroup);

        const outerRingGeo = new THREE.TorusGeometry(1.65, 0.015, 12, 64);
        const outerRingMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0x9f1239,
            roughness: 0.3,
            metalness: 0.8
        });
        this.outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
        this.outerRing.rotation.x = Math.PI / 2;
        this.outerRing.position.y = 0.01;
        this.ringsGroup.add(this.outerRing);

        const innerRingGeo = new THREE.TorusGeometry(1.15, 0.01, 12, 48);
        const innerRingMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            roughness: 0.3,
            metalness: 0.6
        });
        this.innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
        this.innerRing.rotation.x = Math.PI / 2;
        this.innerRing.position.y = 0.012;
        this.ringsGroup.add(this.innerRing);
    }

    /* -------------------------------------------------------------
     * 1. DRIVABLE CYBER CAR
     * ------------------------------------------------------------- */
    buildDrivableCyberCar()
    {
        this.carGroup = new THREE.Group();
        this.carGroup.position.copy(this.vehicleState.pos);
        this.anchor.add(this.carGroup);

        // Car Body Materials
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48, // Crimson Red metallic
            metalness: 0.85,
            roughness: 0.22,
            clearcoat: 0.8,
            clearcoatRoughness: 0.15
        });

        const chassisMat = new THREE.MeshStandardMaterial({
            color: 0x111827,
            metalness: 0.6,
            roughness: 0.4
        });

        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.75
        });

        const neonMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0ea5e9,
            emissiveIntensity: 1.5,
            roughness: 0.2
        });

        // 1. Lower Chassis
        const chassisGeo = new THREE.BoxGeometry(0.56, 0.07, 0.95);
        const chassis = new THREE.Mesh(chassisGeo, chassisMat);
        chassis.position.y = 0.08;
        chassis.castShadow = true;
        this.carGroup.add(chassis);

        // 2. Aerodynamic Main Body
        const mainBodyGeo = new THREE.BoxGeometry(0.52, 0.11, 0.86);
        const mainBody = new THREE.Mesh(mainBodyGeo, bodyMat);
        mainBody.position.y = 0.16;
        mainBody.castShadow = true;
        this.carGroup.add(mainBody);

        // 3. Cabin / Cockpit Canopy
        const cabinGeo = new THREE.BoxGeometry(0.42, 0.10, 0.42);
        const cabin = new THREE.Mesh(cabinGeo, glassMat);
        cabin.position.set(0, 0.245, -0.05);
        cabin.castShadow = true;
        this.carGroup.add(cabin);

        // 4. Rear Spoiler Wing
        const wingGeo = new THREE.BoxGeometry(0.48, 0.025, 0.14);
        const wing = new THREE.Mesh(wingGeo, bodyMat);
        wing.position.set(0, 0.25, 0.36);
        this.carGroup.add(wing);

        const strutGeo = new THREE.BoxGeometry(0.04, 0.09, 0.04);
        const leftStrut = new THREE.Mesh(strutGeo, chassisMat);
        leftStrut.position.set(-0.16, 0.19, 0.36);
        const rightStrut = new THREE.Mesh(strutGeo, chassisMat);
        rightStrut.position.set(0.16, 0.19, 0.36);
        this.carGroup.add(leftStrut, rightStrut);

        // 5. Dual Glowing Headlights
        const headlightGeo = new THREE.BoxGeometry(0.12, 0.035, 0.04);
        const leftHeadlight = new THREE.Mesh(headlightGeo, neonMat);
        leftHeadlight.position.set(-0.19, 0.14, -0.44);
        const rightHeadlight = new THREE.Mesh(headlightGeo, neonMat);
        rightHeadlight.position.set(0.19, 0.14, -0.44);
        this.carGroup.add(leftHeadlight, rightHeadlight);

        // Spotlight forward beams onto the floor
        this.carSpotlight = new THREE.SpotLight(0xa5f3fc, 2.5, 3.5, Math.PI / 4, 0.5);
        this.carSpotlight.position.set(0, 0.18, -0.45);
        const spotTarget = new THREE.Object3D();
        spotTarget.position.set(0, 0, -2.5);
        this.carGroup.add(this.carSpotlight);
        this.carGroup.add(spotTarget);
        this.carSpotlight.target = spotTarget;

        // 6. Dual Red Tail / Brake Lights
        const brakeMat = new THREE.MeshStandardMaterial({
            color: 0xff0033,
            emissive: 0xff0033,
            emissiveIntensity: 1.2
        });
        const brakeGeo = new THREE.BoxGeometry(0.14, 0.03, 0.03);
        const leftBrake = new THREE.Mesh(brakeGeo, brakeMat);
        leftBrake.position.set(-0.18, 0.16, 0.44);
        const rightBrake = new THREE.Mesh(brakeGeo, brakeMat);
        rightBrake.position.set(0.18, 0.16, 0.44);
        this.carGroup.add(leftBrake, rightBrake);

        // 7. Spinning & Steering Wheels
        this.wheels = [];
        const wheelConfigs = [
            { x: -0.28, y: 0.075, z: -0.28, isFront: true },  // Front Left
            { x: 0.28, y: 0.075, z: -0.28, isFront: true },   // Front Right
            { x: -0.28, y: 0.075, z: 0.28, isFront: false },  // Rear Left
            { x: 0.28, y: 0.075, z: 0.28, isFront: false }    // Rear Right
        ];

        const tireMat = new THREE.MeshStandardMaterial({
            color: 0x18181b,
            roughness: 0.8,
            metalness: 0.2
        });

        const rimMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0x9f1239,
            metalness: 0.8,
            roughness: 0.2
        });

        wheelConfigs.forEach(cfg => {
            const wheelHolder = new THREE.Group();
            wheelHolder.position.set(cfg.x, cfg.y, cfg.z);

            const tireGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.065, 18);
            tireGeo.rotateZ(Math.PI / 2);
            const tire = new THREE.Mesh(tireGeo, tireMat);
            tire.castShadow = true;
            wheelHolder.add(tire);

            const rimGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.068, 12);
            rimGeo.rotateZ(Math.PI / 2);
            const rim = new THREE.Mesh(rimGeo, rimMat);
            wheelHolder.add(rim);

            this.carGroup.add(wheelHolder);
            this.wheels.push({ holder: wheelHolder, tire, isFront: cfg.isFront });
        });

        // 8. Exhaust Particle System
        const count = 30;
        const particleGeo = new THREE.BufferGeometry();
        const pPositions = new Float32Array(count * 3);
        for(let i = 0; i < count; i++)
        {
            pPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
            pPositions[i * 3 + 1] = 0.05 + Math.random() * 0.08;
            pPositions[i * 3 + 2] = 0.45 + Math.random() * 0.3;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.03,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        this.exhaustParticles = new THREE.Points(particleGeo, particleMat);
        this.carGroup.add(this.exhaustParticles);
    }

    /* -------------------------------------------------------------
     * 2. 3D PROJECTS SHOWCASE BILLBOARD (With Real Projects Data)
     * ------------------------------------------------------------- */
    build3DProjectsBillboard()
    {
        this.billboardGroup = new THREE.Group();
        // Place billboard in front-left of the stage
        this.billboardGroup.position.set(-1.15, 0, -0.6);
        this.billboardGroup.rotation.y = 0.38;
        this.anchor.add(this.billboardGroup);

        // 1. Sturdy Cyber Frame Pillars
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x1e1526,
            metalness: 0.8,
            roughness: 0.3
        });
        const pillarGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.25, 16);
        const leftPillar = new THREE.Mesh(pillarGeo, frameMat);
        leftPillar.position.set(-0.78, 0.625, 0);
        leftPillar.castShadow = true;

        const rightPillar = new THREE.Mesh(pillarGeo, frameMat);
        rightPillar.position.set(0.78, 0.625, 0);
        rightPillar.castShadow = true;
        this.billboardGroup.add(leftPillar, rightPillar);

        // Ground base plinths
        const plinthGeo = new THREE.BoxGeometry(0.24, 0.06, 0.24);
        const leftPlinth = new THREE.Mesh(plinthGeo, frameMat);
        leftPlinth.position.set(-0.78, 0.03, 0);
        const rightPlinth = new THREE.Mesh(plinthGeo, frameMat);
        rightPlinth.position.set(0.78, 0.03, 0);
        this.billboardGroup.add(leftPlinth, rightPlinth);

        // Top Header Banner
        const topBarGeo = new THREE.BoxGeometry(1.68, 0.08, 0.08);
        const topBar = new THREE.Mesh(topBarGeo, frameMat);
        topBar.position.set(0, 1.26, 0);
        this.billboardGroup.add(topBar);

        // Neon Glowing Trim Frame
        const neonBorderMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0xbe123c,
            roughness: 0.2,
            metalness: 0.7
        });
        const borderGeo = new THREE.BoxGeometry(1.54, 0.86, 0.03);
        const borderMesh = new THREE.Mesh(borderGeo, neonBorderMat);
        borderMesh.position.set(0, 0.78, -0.015);
        this.billboardGroup.add(borderMesh);

        // 2. High-Resolution Interactive Canvas Display Screen
        this.screenCanvas = document.createElement('canvas');
        this.screenCanvas.width = 1024;
        this.screenCanvas.height = 576;
        this.screenCtx = this.screenCanvas.getContext('2d');
        this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
        this.screenTexture.colorSpace = THREE.SRGBColorSpace;

        const screenGeo = new THREE.PlaneGeometry(1.48, 0.80);
        const screenMat = new THREE.MeshBasicMaterial({
            map: this.screenTexture,
            transparent: false
        });
        this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
        this.screenMesh.position.set(0, 0.78, 0.015);
        this.screenMesh.userData = { isScreen: true };
        this.billboardGroup.add(this.screenMesh);

        // 3. Interactive 3D Previous & Next Floating Buttons
        const btnGeo = new THREE.BoxGeometry(0.12, 0.18, 0.05);
        const btnMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            roughness: 0.2
        });

        this.prev3DBtn = new THREE.Mesh(btnGeo, btnMat);
        this.prev3DBtn.position.set(-0.88, 0.78, 0.02);
        this.prev3DBtn.userData = { isPrevBtn: true };

        this.next3DBtn = new THREE.Mesh(btnGeo, btnMat);
        this.next3DBtn.position.set(0.88, 0.78, 0.02);
        this.next3DBtn.userData = { isNextBtn: true };

        this.billboardGroup.add(this.prev3DBtn, this.next3DBtn);

        // Render initial project slide
        this.updateBillboardSlide();
    }

    updateBillboardSlide()
    {
        const proj = this.projects[this.currentProjectIndex];
        if(!proj || !this.screenCtx) return;

        const ctx = this.screenCtx;
        const w = 1024;
        const h = 576;

        // Background Cyber Gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#1a0b1d');
        grad.addColorStop(0.5, '#26102a');
        grad.addColorStop(1, '#110714');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Subtle cyber grid lines
        ctx.strokeStyle = 'rgba(225, 29, 72, 0.12)';
        ctx.lineWidth = 1;
        for(let x = 0; x < w; x += 64)
        {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for(let y = 0; y < h; y += 64)
        {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Top Accent Strip
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(40, 36, w - 80, 4);

        // Category Tag
        ctx.fillStyle = '#ff6b81';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        ctx.fillText(proj.category ? proj.category.toUpperCase() : 'ENGINEERING PROJECT', 46, 76);

        // Slide Counter
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 20px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`PROJECT ${this.currentProjectIndex + 1} OF ${this.projects.length}`, w - 46, 76);
        ctx.textAlign = 'left';

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px -apple-system, sans-serif';
        ctx.fillText(proj.title, 46, 136);

        // Tagline
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        const tagline = proj.tagline || (proj.attributes && proj.attributes.at) || 'Full-Stack & Security Architecture';
        ctx.fillText(tagline, 46, 176);

        // Description Paragraph
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '22px -apple-system, sans-serif';
        const descWords = proj.description.split(' ');
        let line = '';
        let startY = 228;
        const maxLineWidth = w - 100;

        for(let i = 0; i < descWords.length; i++)
        {
            const testLine = line + descWords[i] + ' ';
            const metrics = ctx.measureText(testLine);
            if(metrics.width > maxLineWidth && i > 0)
            {
                ctx.fillText(line, 46, startY);
                line = descWords[i] + ' ';
                startY += 32;
                if(startY > 350) { line += '...'; break; }
            }
            else
            {
                line = testLine;
            }
        }
        ctx.fillText(line, 46, startY);

        // Tech Stack Badges
        if(proj.techStack)
        {
            let badgeX = 46;
            const badgeY = 400;
            proj.techStack.slice(0, 5).forEach(tech => {
                ctx.font = 'bold 18px -apple-system, sans-serif';
                const textWidth = ctx.measureText(tech).width;
                const badgeWidth = textWidth + 24;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, 34, 10);
                ctx.fill();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.fillText(tech, badgeX + 12, badgeY + 23);
                badgeX += badgeWidth + 12;
            });
        }

        // Bottom CTA Prompt
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.roundRect(46, 474, 380, 54, 18);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        ctx.fillText('🔍 TAP TO VIEW DETAILS & REPO', 66, 509);

        this.screenTexture.needsUpdate = true;

        if(this.projCounter)
        {
            this.projCounter.textContent = `${this.currentProjectIndex + 1} / ${this.projects.length}`;
        }
    }

    nextProject()
    {
        this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length;
        this.updateBillboardSlide();
        this.playTone(587, 0.1); // D5
    }

    prevProject()
    {
        this.currentProjectIndex = (this.currentProjectIndex - 1 + this.projects.length) % this.projects.length;
        this.updateBillboardSlide();
        this.playTone(493, 0.1); // B4
    }

    /* -------------------------------------------------------------
     * 3. 3D CAREER STONES (Parity with CareerArea.js)
     * ------------------------------------------------------------- */
    build3DCareerStones()
    {
        this.careerGroup = new THREE.Group();
        // Place career stones along a right curved path
        this.careerGroup.position.set(1.1, 0, -0.4);
        this.careerGroup.rotation.y = -0.35;
        this.anchor.add(this.careerGroup);

        this.stones = [];
        const stoneGeo = new THREE.BoxGeometry(0.36, 0.52, 0.12);

        this.careerMilestones.forEach((mile, idx) => {
            const stoneHolder = new THREE.Group();
            // Position along a slight spiral / staggered row
            const angle = (idx / this.careerMilestones.length) * Math.PI * 0.9;
            const radius = 0.55 + idx * 0.18;
            stoneHolder.position.set(
                Math.cos(angle) * radius - 0.2,
                0.26,
                Math.sin(angle) * radius - 0.3
            );
            stoneHolder.rotation.y = -angle * 0.4;

            // Stone Body
            const stoneMat = new THREE.MeshStandardMaterial({
                color: 0x1b1322,
                roughness: 0.6,
                metalness: 0.4
            });
            const stoneMesh = new THREE.Mesh(stoneGeo, stoneMat);
            stoneMesh.castShadow = true;
            stoneHolder.add(stoneMesh);

            // Glowing Neon Accent Rim
            const accentMat = new THREE.MeshStandardMaterial({
                color: mile.color,
                emissive: mile.color,
                emissiveIntensity: 0.8,
                roughness: 0.3
            });
            const rimGeo = new THREE.BoxGeometry(0.38, 0.04, 0.13);
            const topRim = new THREE.Mesh(rimGeo, accentMat);
            topRim.position.y = 0.25;
            stoneHolder.add(topRim);

            // Etched Front Text Canvas Texture
            const textCanvas = document.createElement('canvas');
            textCanvas.width = 256;
            textCanvas.height = 256;
            const tctx = textCanvas.getContext('2d');
            tctx.fillStyle = '#1b1322';
            tctx.fillRect(0, 0, 256, 256);

            tctx.fillStyle = '#ffffff';
            tctx.font = 'bold 26px -apple-system, sans-serif';
            tctx.textAlign = 'center';
            tctx.fillText(mile.institution.toUpperCase(), 128, 90);

            tctx.fillStyle = '#38bdf8';
            tctx.font = 'bold 18px -apple-system, sans-serif';
            tctx.fillText(mile.date, 128, 140);

            tctx.fillStyle = '#e2e8f0';
            tctx.font = '16px -apple-system, sans-serif';
            tctx.fillText(mile.highlight.substring(0, 22), 128, 180);

            const textTex = new THREE.CanvasTexture(textCanvas);
            textTex.colorSpace = THREE.SRGBColorSpace;
            const textPlaneGeo = new THREE.PlaneGeometry(0.32, 0.32);
            const textPlaneMat = new THREE.MeshBasicMaterial({ map: textTex });
            const textPlane = new THREE.Mesh(textPlaneGeo, textPlaneMat);
            textPlane.position.set(0, 0, 0.062);
            stoneHolder.add(textPlane);

            stoneHolder.userData = { milestoneIndex: idx, mesh: stoneMesh, baseElevation: 0.26 };
            this.careerGroup.add(stoneHolder);
            this.stones.push(stoneHolder);
        });
    }

    elevateCareerStone(index)
    {
        const mile = this.careerMilestones[index];
        const holder = this.stones[index];
        if(!mile || !holder) return;

        // Animate stone elevation & play stone slide sound
        this.playTone(330, 0.2); // E4
        const startY = holder.position.y;
        const targetY = holder.userData.baseElevation + 0.18;
        const duration = 0.35;
        const startTime = this.clock.getElapsedTime();

        const updateElevation = () => {
            const elapsed = this.clock.getElapsedTime() - startTime;
            if(elapsed < duration)
            {
                const p = elapsed / duration;
                holder.position.y = THREE.MathUtils.lerp(startY, targetY, p);
                requestAnimationFrame(updateElevation);
            }
            else
            {
                holder.position.y = targetY;
            }
        };
        updateElevation();

        this.openCareerModal(index);
    }

    /* -------------------------------------------------------------
     * 4. ARCADE BOWLING ALLEY ON REAL FLOOR
     * ------------------------------------------------------------- */
    buildArcadeBowlingAlley()
    {
        this.bowlingGroup = new THREE.Group();
        // Position pins at the far center-right of the room stage
        this.bowlingGroup.position.set(0.15, 0, -1.25);
        this.anchor.add(this.bowlingGroup);

        this.pins = [];
        this.pinsKnocked = 0;

        // 6 Pins in a triangle formation:
        //       [5]
        //     [3] [4]
        //   [0] [1] [2]
        const pinPositions = [
            { x: -0.16, z: 0.16 }, // Row 1 Left
            { x: 0.00,  z: 0.16 }, // Row 1 Center
            { x: 0.16,  z: 0.16 }, // Row 1 Right
            { x: -0.08, z: 0.00 }, // Row 2 Left
            { x: 0.08,  z: 0.00 }, // Row 2 Right
            { x: 0.00,  z: -0.16 } // Apex Pin
        ];

        const pinBodyGeo = new THREE.CylinderGeometry(0.024, 0.042, 0.22, 14);
        const pinHeadGeo = new THREE.SphereGeometry(0.035, 12, 10);
        const pinMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.2,
            metalness: 0.1
        });
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });

        pinPositions.forEach((pos, idx) => {
            const pinHolder = new THREE.Group();
            pinHolder.position.set(pos.x, 0.11, pos.z);

            const body = new THREE.Mesh(pinBodyGeo, pinMat);
            body.castShadow = true;
            pinHolder.add(body);

            const head = new THREE.Mesh(pinHeadGeo, pinMat);
            head.position.y = 0.11;
            pinHolder.add(head);

            const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.03, 14), stripeMat);
            stripe.position.y = 0.06;
            pinHolder.add(stripe);

            pinHolder.userData = {
                index: idx,
                initialPos: new THREE.Vector3(pos.x, 0.11, pos.z),
                initialRot: new THREE.Euler(0, 0, 0),
                isKnocked: false,
                vx: 0,
                vz: 0,
                vRotX: 0,
                vRotZ: 0
            };

            this.bowlingGroup.add(pinHolder);
            this.pins.push(pinHolder);
        });
    }

    resetBowlingPins()
    {
        this.pinsKnocked = 0;
        this.pins.forEach(pin => {
            pin.userData.isKnocked = false;
            pin.userData.vx = 0;
            pin.userData.vz = 0;
            pin.userData.vRotX = 0;
            pin.userData.vRotZ = 0;
            pin.position.copy(pin.userData.initialPos);
            pin.rotation.set(0, 0, 0);
        });
        const scoreElem = document.querySelector('#bowling-score');
        if(scoreElem) scoreElem.textContent = 'Drive car into pins! 🎳';
        this.showSpeech('Pins reset! Ready to bowl! 🎳✨');
        this.playTone(440, 0.15);
    }

    checkCarBowlingCollisions()
    {
        if(!this.carGroup || !this.pins) return;

        // Transform car position to bowling group local coordinates
        const carWorldPos = new THREE.Vector3();
        this.carGroup.getWorldPosition(carWorldPos);

        const bowlingWorldPos = new THREE.Vector3();
        this.bowlingGroup.getWorldPosition(bowlingWorldPos);

        const carSpeed = this.vehicleState.speed;
        let knockedThisFrame = 0;

        this.pins.forEach(pin => {
            if(pin.userData.isKnocked) return;

            const pinWorldPos = new THREE.Vector3();
            pin.getWorldPosition(pinWorldPos);

            const dist = carWorldPos.distanceTo(pinWorldPos);
            if(dist < 0.28) // Collision radius
            {
                pin.userData.isKnocked = true;
                this.pinsKnocked++;
                knockedThisFrame++;

                // Impulse physics
                const impactForce = Math.max(carSpeed, 1.2);
                const angle = this.vehicleState.heading;
                pin.userData.vx = -Math.sin(angle) * impactForce * 0.08 + (Math.random() - 0.5) * 0.04;
                pin.userData.vz = -Math.cos(angle) * impactForce * 0.08 + (Math.random() - 0.5) * 0.04;
                pin.userData.vRotX = (Math.random() - 0.5) * 0.4;
                pin.userData.vRotZ = (Math.random() - 0.5) * 0.4;

                this.playPinHit();
            }
        });

        if(knockedThisFrame > 0)
        {
            const scoreElem = document.querySelector('#bowling-score');
            if(scoreElem) scoreElem.textContent = `Pins: ${this.pinsKnocked} / 6 Knocked!`;

            if(this.pinsKnocked === 6)
            {
                this.triggerStrike();
            }
        }
    }

    triggerStrike()
    {
        this.playStrikeChime();
        this.showSpeech('STRIKE!! YOU ARE A LEGEND! 🎳🎉');

        if(this.strikeBanner)
        {
            this.strikeBanner.classList.add('is-visible');
            setTimeout(() => {
                this.strikeBanner.classList.remove('is-visible');
            }, 2400);
        }
    }

    /* -------------------------------------------------------------
     * 5. CHARACTER ADITI (Guide & Welcome Avatar)
     * ------------------------------------------------------------- */
    loadCharacter()
    {
        const loader = new GLTFLoader();
        loader.load('ar/aditi-avatar.glb', (gltf) => {
            this.character = gltf.scene;
            this.character.position.set(0.68, 0, 0.15);
            this.character.rotation.y = Math.PI * 0.9;
            this.character.scale.set(0.65, 0.65, 0.65);
            this.anchor.add(this.character);

            this.jumpCharacter('Welcome to my AR Portfolio! 🚗💨');
        }, undefined, (err) => {
            console.error('Error loading AR avatar:', err);
        });
    }

    jumpCharacter(speechText = null)
    {
        if(!this.character) return;
        const startY = this.character.position.y;
        const targetY = startY + 0.25;
        const duration = 0.4;
        const startTime = this.clock.getElapsedTime();

        const updateJump = () => {
            const elapsed = this.clock.getElapsedTime() - startTime;
            if(elapsed < duration)
            {
                const p = elapsed / duration;
                const sinVal = Math.sin(p * Math.PI);
                this.character.position.y = startY + sinVal * 0.25;
                this.character.rotation.y += 0.08;
                requestAnimationFrame(updateJump);
            }
            else
            {
                this.character.position.y = startY;
            }
        };
        updateJump();

        if(speechText) this.showSpeech(speechText);
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
        }, 3400);
    }

    updateSpeechPosition()
    {
        if(!this.speechBubble || !this.anchor) return;
        const headPos = new THREE.Vector3(0, 1.6, 0).applyMatrix4(this.anchor.matrixWorld);
        const screenPos = headPos.clone().project(this.camera);

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight - 30;

        this.speechBubble.style.left = `${x}px`;
        this.speechBubble.style.top = `${y}px`;
        this.speechBubble.style.transform = `translate(-50%, -100%)`;
    }

    /* -------------------------------------------------------------
     * CAMERA SNAPSHOT FUNCTIONALITY
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

        if(this.video && this.video.readyState >= 2)
        {
            const vw = this.video.videoWidth;
            const vh = this.video.videoHeight;
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.roundRect(24, height - 60, 310, 36, 18);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px -apple-system, sans-serif';
        ctx.fillText('Aditi Sharma • 3D Portfolio AR', 40, height - 37);

        const dataUrl = captureCanvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.download = `aditi-ar-portfolio-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();

        this.showSpeech('Saved AR Photo to device! 📸✨');
    }

    /* -------------------------------------------------------------
     * DOM LISTENERS, MODALS & NAVIGATION DOCK
     * ------------------------------------------------------------- */
    initDOMListeners()
    {
        // Sound Toggle
        if(this.soundBtn)
        {
            this.soundBtn.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                this.soundIcon.textContent = this.soundEnabled ? '🔊' : '🔇';
                this.showSpeech(this.soundEnabled ? 'Sound Enabled 🔊' : 'Sound Muted 🔇');
            });
        }

        // Recenter 3D World Anchor
        const btnRecenter = document.querySelector('#btn-recenter');
        if(btnRecenter)
        {
            btnRecenter.addEventListener('click', () => {
                this.anchor.position.set(0, 0, 0);
                this.anchor.scale.set(1, 1, 1);
                this.anchor.rotation.set(0, 0, 0);
                this.vehicleState.pos.set(0, 0, 0.4);
                this.vehicleState.heading = 0;
                this.vehicleState.speed = 0;
                this.camera.position.set(0, 1.75, 3.4);
                this.camera.lookAt(0, 0.5, 0);
                this.showSpeech('Recentered AR World! 🎯');
            });
        }

        // Camera flip & start
        const btnStartCam = document.querySelector('#btn-start-camera');
        if(btnStartCam) btnStartCam.addEventListener('click', () => this.initCamera());

        const btnSkipCam = document.querySelector('#btn-skip-camera');
        if(btnSkipCam)
        {
            btnSkipCam.addEventListener('click', () => {
                if(this.permissionBanner) this.permissionBanner.classList.add('is-hidden');
                if(this.statusText) this.statusText.textContent = 'AR: 3D WORLD SIMULATION';
                this.showSpeech('Welcome to the AR World! 🚗✨');
            });
        }

        const btnFlipCam = document.querySelector('#btn-flip-cam');
        if(btnFlipCam) btnFlipCam.addEventListener('click', () => this.flipCamera());

        // Snapshot & Pose
        const btnSnapshot = document.querySelector('#btn-snapshot');
        if(btnSnapshot) btnSnapshot.addEventListener('click', () => this.takeSnapshot());

        const btnPose = document.querySelector('#btn-pose');
        if(btnPose) btnPose.addEventListener('click', () => this.jumpCharacter('Level Up! 🌟 2500 CP'));

        // Profile card click opens About modal
        const btnProfileCard = document.querySelector('#btn-profile-card');
        if(btnProfileCard) btnProfileCard.addEventListener('click', () => this.openAboutModal());

        // Mode Navigation Dock
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.mode;
                this.setMode(mode);
            });
        });

        // Project Carousel Buttons in Drawer
        const btnProjPrev = document.querySelector('#btn-proj-prev');
        if(btnProjPrev) btnProjPrev.addEventListener('click', () => this.prevProject());

        const btnProjNext = document.querySelector('#btn-proj-next');
        if(btnProjNext) btnProjNext.addEventListener('click', () => this.nextProject());

        const btnProjInspect = document.querySelector('#btn-proj-inspect');
        if(btnProjInspect) btnProjInspect.addEventListener('click', () => this.openProjectModal(this.currentProjectIndex));

        // Career Chips in Drawer
        document.querySelectorAll('.career-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const idx = parseInt(chip.dataset.career, 10);
                this.elevateCareerStone(idx);
            });
        });

        // Bowling Reset
        const btnResetPins = document.querySelector('#btn-reset-pins');
        if(btnResetPins) btnResetPins.addEventListener('click', () => this.resetBowlingPins());

        const btnAimBowling = document.querySelector('#btn-aim-bowling');
        if(btnAimBowling) btnAimBowling.addEventListener('click', () => {
            // Reposition car directly in front of pins
            this.vehicleState.pos.set(0.15, 0, -0.4);
            this.vehicleState.heading = Math.PI;
            this.vehicleState.speed = 0;
            this.showSpeech('Aimed at bowling alley! Hit gas! 🎳🚗');
        });

        // Modals Close Buttons
        const btnModalClose = document.querySelector('#btn-modal-close');
        if(btnModalClose) btnModalClose.addEventListener('click', () => this.closeProjectModal());

        const btnCareerClose = document.querySelector('#btn-career-close');
        if(btnCareerClose) btnCareerClose.addEventListener('click', () => this.closeCareerModal());

        const btnAboutClose = document.querySelector('#btn-about-close');
        if(btnAboutClose) btnAboutClose.addEventListener('click', () => this.closeAboutModal());

        const btnContactClose = document.querySelector('#btn-contact-close');
        if(btnContactClose) btnContactClose.addEventListener('click', () => this.closeContactModal());

        // On-screen Drive Controls
        this.initVirtualDrivePad();
    }

    setMode(mode, immediate = false)
    {
        this.currentMode = mode;
        this.playTone(523, 0.08); // C5

        // Update active dock tab
        document.querySelectorAll('.mode-tab').forEach(t => {
            if(t.dataset.mode === mode) t.classList.add('is-active');
            else t.classList.remove('is-active');
        });

        // Toggle drawers
        if(this.panelProjects) this.panelProjects.classList.remove('is-active');
        if(this.panelCareer) this.panelCareer.classList.remove('is-active');
        if(this.panelArcade) this.panelArcade.classList.remove('is-active');
        if(this.virtualControls) this.virtualControls.classList.add('is-hidden');

        if(mode === 'drive')
        {
            if(this.virtualControls) this.virtualControls.classList.remove('is-hidden');
            if(this.statusText) this.statusText.textContent = 'AR: DRIVE MODE • STEER & GAS ON FLOOR';
            this.showSpeech('Drive around your room! 🚗💨');
            this.focusCameraOn(new THREE.Vector3(0, 1.75, 3.4), new THREE.Vector3(0, 0.5, 0), immediate);
        }
        else if(mode === 'projects')
        {
            if(this.panelProjects) this.panelProjects.classList.add('is-active');
            if(this.statusText) this.statusText.textContent = 'AR: 3D BILLBOARD • PROJECTS SHOWCASE';
            this.showSpeech('Explore my engineering projects! 📂✨');
            // Frame billboard
            this.focusCameraOn(new THREE.Vector3(-1.15, 0.9, 1.55), new THREE.Vector3(-1.15, 0.75, -0.6), immediate);
        }
        else if(mode === 'career')
        {
            if(this.panelCareer) this.panelCareer.classList.add('is-active');
            if(this.statusText) this.statusText.textContent = 'AR: CAREER STONES • TIMELINE';
            this.showSpeech('Tap the stones to see my career milestones! 💼');
            this.focusCameraOn(new THREE.Vector3(1.1, 1.35, 1.6), new THREE.Vector3(1.1, 0.45, -0.4), immediate);
        }
        else if(mode === 'arcade')
        {
            if(this.panelArcade) this.panelArcade.classList.add('is-active');
            if(this.virtualControls) this.virtualControls.classList.remove('is-hidden');
            if(this.statusText) this.statusText.textContent = 'AR: BOWLING ALLEY • KNOCK DOWN PINS!';
            this.showSpeech('Drive into the pins for a strike! 🎳');
            this.focusCameraOn(new THREE.Vector3(0.15, 1.45, 0.7), new THREE.Vector3(0.15, 0.2, -1.25), immediate);
        }
        else if(mode === 'about')
        {
            this.openAboutModal();
        }
        else if(mode === 'contact')
        {
            this.openContactModal();
        }
    }

    focusCameraOn(camTargetPos, lookTarget, immediate = false)
    {
        if(immediate)
        {
            this.camera.position.copy(camTargetPos);
            this.camera.lookAt(lookTarget);
            return;
        }

        const startPos = this.camera.position.clone();
        const duration = 0.6;
        const startTime = this.clock.getElapsedTime();

        const animateCam = () => {
            const elapsed = this.clock.getElapsedTime() - startTime;
            if(elapsed < duration)
            {
                const p = elapsed / duration;
                this.camera.position.lerpVectors(startPos, camTargetPos, p);
                this.camera.lookAt(lookTarget);
                requestAnimationFrame(animateCam);
            }
            else
            {
                this.camera.position.copy(camTargetPos);
                this.camera.lookAt(lookTarget);
            }
        };
        animateCam();
    }

    /* -------------------------------------------------------------
     * VIRTUAL ON-SCREEN DRIVE JOYSTICK & BUTTONS
     * ------------------------------------------------------------- */
    initVirtualDrivePad()
    {
        const zone = document.querySelector('#joystick-zone');
        const stick = document.querySelector('#joystick-stick');
        let isTouchingJoy = false;
        let joyCenterX = 0;
        let joyCenterY = 0;
        const maxDist = 42;

        if(zone && stick)
        {
            const handleTouchStart = (e) => {
                isTouchingJoy = true;
                const rect = zone.getBoundingClientRect();
                joyCenterX = rect.left + rect.width / 2;
                joyCenterY = rect.top + rect.height / 2;
                handleTouchMove(e);
            };

            const handleTouchMove = (e) => {
                if(!isTouchingJoy) return;
                const touch = e.touches ? e.touches[0] : e;
                const dx = touch.clientX - joyCenterX;
                const dy = touch.clientY - joyCenterY;
                const dist = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx);

                const clampedDist = Math.min(dist, maxDist);
                const stickX = Math.cos(angle) * clampedDist;
                const stickY = Math.sin(angle) * clampedDist;

                stick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;

                // Set inputs:
                // dy < 0 is forward, dy > 0 is reverse
                this.input.forward = -stickY / maxDist;
                this.input.turn = -stickX / maxDist;
            };

            const handleTouchEnd = () => {
                isTouchingJoy = false;
                stick.style.transform = `translate(-50%, -50%)`;
                this.input.forward = 0;
                this.input.turn = 0;
            };

            zone.addEventListener('touchstart', handleTouchStart, { passive: true });
            zone.addEventListener('touchmove', handleTouchMove, { passive: true });
            zone.addEventListener('touchend', handleTouchEnd);
        }

        // Gas & Brake Pedals
        const btnGas = document.querySelector('#btn-gas');
        if(btnGas)
        {
            btnGas.addEventListener('touchstart', (e) => { e.preventDefault(); this.input.forward = 1; });
            btnGas.addEventListener('touchend', () => { this.input.forward = 0; });
            btnGas.addEventListener('mousedown', () => { this.input.forward = 1; });
            btnGas.addEventListener('mouseup', () => { this.input.forward = 0; });
        }

        const btnRev = document.querySelector('#btn-reverse');
        if(btnRev)
        {
            btnRev.addEventListener('touchstart', (e) => { e.preventDefault(); this.input.forward = -0.7; });
            btnRev.addEventListener('touchend', () => { this.input.forward = 0; });
            btnRev.addEventListener('mousedown', () => { this.input.forward = -0.7; });
            btnRev.addEventListener('mouseup', () => { this.input.forward = 0; });
        }

        const btnHonk = document.querySelector('#btn-honk');
        if(btnHonk)
        {
            btnHonk.addEventListener('click', () => this.playHonk());
        }

        const btnBoost = document.querySelector('#btn-boost');
        if(btnBoost)
        {
            btnBoost.addEventListener('touchstart', (e) => { e.preventDefault(); this.input.boost = true; });
            btnBoost.addEventListener('touchend', () => { this.input.boost = false; });
            btnBoost.addEventListener('mousedown', () => { this.input.boost = true; });
            btnBoost.addEventListener('mouseup', () => { this.input.boost = false; });
        }
    }

    /* -------------------------------------------------------------
     * KEYBOARD FALLBACK (Desktop / Testing Support)
     * ------------------------------------------------------------- */
    initKeyboardControls()
    {
        window.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.input.forward = 1;
            if(e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.input.forward = -0.7;
            if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.input.turn = 1;
            if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.input.turn = -1;
            if(e.key === 'Shift') this.input.boost = true;
            if(e.key === 'h' || e.key === 'H') this.playHonk();
        });

        window.addEventListener('keyup', (e) => {
            if(['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S'].includes(e.key)) this.input.forward = 0;
            if(['ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(e.key)) this.input.turn = 0;
            if(e.key === 'Shift') this.input.boost = false;
        });
    }

    /* -------------------------------------------------------------
     * RAYCASTING & TOUCH GESTURES (Move / Pinch / Rotate Scene)
     * ------------------------------------------------------------- */
    initTouchControls()
    {
        let touches = [];
        let initialDist = 0;
        let initialAngle = 0;
        let initialScale = 1;
        let initialWorldRot = 0;
        let isDraggingWorld = false;
        let lastTouchX = 0;
        let lastTouchY = 0;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.canvas.addEventListener('touchstart', (e) => {
            touches = e.touches;
            if(touches.length === 1)
            {
                isDraggingWorld = true;
                lastTouchX = touches[0].clientX;
                lastTouchY = touches[0].clientY;

                // Raycast interactive objects
                mouse.x = (touches[0].clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(touches[0].clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, this.camera);

                // 1. Check Billboard screen & 3D arrows
                const hits = raycaster.intersectObjects(this.billboardGroup.children, true);
                if(hits.length > 0)
                {
                    const hitObj = hits[0].object;
                    if(hitObj.userData.isPrevBtn)
                    {
                        this.prevProject();
                        isDraggingWorld = false;
                        return;
                    }
                    if(hitObj.userData.isNextBtn)
                    {
                        this.nextProject();
                        isDraggingWorld = false;
                        return;
                    }
                    if(hitObj.userData.isScreen)
                    {
                        this.openProjectModal(this.currentProjectIndex);
                        isDraggingWorld = false;
                        return;
                    }
                }

                // 2. Check Career Stones
                const stoneHits = raycaster.intersectObjects(this.careerGroup.children, true);
                if(stoneHits.length > 0)
                {
                    // Find parent stone holder
                    let curr = stoneHits[0].object;
                    while(curr && curr.parent !== this.careerGroup)
                    {
                        curr = curr.parent;
                    }
                    if(curr && curr.userData && curr.userData.milestoneIndex !== undefined)
                    {
                        this.elevateCareerStone(curr.userData.milestoneIndex);
                        isDraggingWorld = false;
                        return;
                    }
                }

                // 3. Check Character
                if(this.character)
                {
                    const charHits = raycaster.intersectObjects(this.character.children, true);
                    if(charHits.length > 0)
                    {
                        const speechPhrases = [
                            'Welcome to my AR Portfolio! 🚗💨',
                            'I am Aditi Sharma, Full-Stack & AI Engineer!',
                            'Check out the 3D billboard on your floor!',
                            'Drive the car into the bowling pins for a strike! 🎳',
                            'Explore my career stones from VIT Vellore to HCLTech!'
                        ];
                        const phrase = speechPhrases[Math.floor(Math.random() * speechPhrases.length)];
                        this.jumpCharacter(phrase);
                        isDraggingWorld = false;
                        return;
                    }
                }
            }
            else if(touches.length === 2)
            {
                isDraggingWorld = false;
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                initialDist = Math.hypot(dx, dy);
                initialAngle = Math.atan2(dy, dx);
                initialScale = this.anchor.scale.x;
                initialWorldRot = this.anchor.rotation.y;
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            touches = e.touches;
            if(touches.length === 1 && isDraggingWorld)
            {
                const dx = touches[0].clientX - lastTouchX;
                const dy = touches[0].clientY - lastTouchY;
                lastTouchX = touches[0].clientX;
                lastTouchY = touches[0].clientY;

                // Move anchor along floor X and Z
                this.anchor.position.x += dx * 0.0035;
                this.anchor.position.z += dy * 0.0035;
            }
            else if(touches.length === 2)
            {
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx);

                if(initialDist > 0)
                {
                    // Pinch scale
                    const scaleFactor = dist / initialDist;
                    const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.25), 2.8);
                    this.anchor.scale.set(newScale, newScale, newScale);

                    // Twist rotate
                    const rotDelta = angle - initialAngle;
                    this.anchor.rotation.y = initialWorldRot + rotDelta;
                }
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            isDraggingWorld = false;
            initialDist = 0;
        });

        // Desktop mouse drag support
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

            const hits = raycaster.intersectObjects(this.billboardGroup.children, true);
            if(hits.length > 0)
            {
                const hitObj = hits[0].object;
                if(hitObj.userData.isPrevBtn) { this.prevProject(); return; }
                if(hitObj.userData.isNextBtn) { this.nextProject(); return; }
                if(hitObj.userData.isScreen) { this.openProjectModal(this.currentProjectIndex); return; }
            }

            const stoneHits = raycaster.intersectObjects(this.careerGroup.children, true);
            if(stoneHits.length > 0)
            {
                let curr = stoneHits[0].object;
                while(curr && curr.parent !== this.careerGroup) { curr = curr.parent; }
                if(curr && curr.userData && curr.userData.milestoneIndex !== undefined)
                {
                    this.elevateCareerStone(curr.userData.milestoneIndex);
                    return;
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

        window.addEventListener('mouseup', () => { isMouseDown = false; });
    }

    /* -------------------------------------------------------------
     * GYROSCOPE (Phone Motion Tracking)
     * ------------------------------------------------------------- */
    initDeviceOrientation()
    {
        const handleOrientation = (e) => {
            if(e.gamma === null || e.beta === null) return;
            const targetCamX = (e.gamma / 90) * 0.45;
            const targetCamY = 1.75 + ((e.beta - 50) / 90) * 0.35;

            this.camera.position.x += (targetCamX - this.camera.position.x) * 0.05;
            this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.anchor.position.x, this.anchor.position.y + 0.6, this.anchor.position.z);
        };

        if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function')
        {
            document.body.addEventListener('click', () => {
                DeviceOrientationEvent.requestPermission().then(res => {
                    if(res === 'granted') window.addEventListener('deviceorientation', handleOrientation);
                }).catch(() => {});
            }, { once: true });
        }
        else
        {
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    /* -------------------------------------------------------------
     * MODALS DATA BINDING
     * ------------------------------------------------------------- */
    openProjectModal(index)
    {
        const proj = this.projects[index];
        if(!proj || !this.holoModal) return;

        document.querySelector('#modal-category').textContent = proj.category || 'PROJECT';
        document.querySelector('#modal-title').textContent = proj.title;
        document.querySelector('#modal-tagline').textContent = proj.tagline || (proj.attributes && proj.attributes.at) || '';
        document.querySelector('#modal-desc').textContent = proj.description;

        const problemElem = document.querySelector('#modal-problem');
        if(problemElem) problemElem.textContent = proj.problemSolved || '';

        const featuresList = document.querySelector('#modal-features');
        if(featuresList)
        {
            featuresList.innerHTML = '';
            if(proj.keyFeatures && proj.keyFeatures.length > 0)
            {
                proj.keyFeatures.forEach(feat => {
                    const li = document.createElement('li');
                    li.textContent = feat;
                    featuresList.appendChild(li);
                });
            }
        }

        const tagsContainer = document.querySelector('#modal-tags');
        if(tagsContainer)
        {
            tagsContainer.innerHTML = '';
            (proj.techStack || []).forEach(t => {
                const span = document.createElement('span');
                span.textContent = t;
                tagsContainer.appendChild(span);
            });
        }

        const linkBtn = document.querySelector('#modal-link');
        if(linkBtn) linkBtn.href = proj.url || 'https://github.com/jiya2000';

        this.holoModal.classList.add('is-open');
    }

    closeProjectModal()
    {
        if(this.holoModal) this.holoModal.classList.remove('is-open');
    }

    openCareerModal(index)
    {
        const mile = this.careerMilestones[index];
        if(!mile || !this.careerModal) return;

        document.querySelector('#career-title').textContent = mile.institution;
        document.querySelector('#career-role').textContent = `${mile.role} (${mile.date})`;
        document.querySelector('#career-desc').textContent = mile.desc;

        const tagsContainer = document.querySelector('#career-tags');
        if(tagsContainer)
        {
            tagsContainer.innerHTML = '';
            mile.skills.forEach(s => {
                const span = document.createElement('span');
                span.textContent = s;
                tagsContainer.appendChild(span);
            });
        }

        this.careerModal.classList.add('is-open');
    }

    closeCareerModal()
    {
        if(this.careerModal) this.careerModal.classList.remove('is-open');
    }

    openAboutModal()
    {
        if(this.aboutModal) this.aboutModal.classList.add('is-open');
    }

    closeAboutModal()
    {
        if(this.aboutModal) this.aboutModal.classList.remove('is-open');
    }

    openContactModal()
    {
        if(this.contactModal) this.contactModal.classList.add('is-open');
    }

    closeContactModal()
    {
        if(this.contactModal) this.contactModal.classList.remove('is-open');
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
     * MAIN ANIMATION LOOP & PHYSICS UPDATE
     * ------------------------------------------------------------- */
    animate()
    {
        requestAnimationFrame(() => this.animate());

        const delta = Math.min(this.clock.getDelta(), 0.1);
        const elapsedTime = this.clock.getElapsedTime();

        // 1. Vehicle Driving Physics
        this.updateVehiclePhysics(delta);

        // 2. Bowling Collisions & Pin Physics
        this.checkCarBowlingCollisions();
        this.updatePinPhysics(delta);

        // 3. Cyber Rings & Subtle Ambient Animations
        if(this.outerRing) this.outerRing.rotation.z = elapsedTime * 0.35;
        if(this.innerRing) this.innerRing.rotation.z = -elapsedTime * 0.55;

        // 4. Idle breathing for Aditi
        if(this.character && this.character.position.y === 0)
        {
            this.character.position.y = Math.sin(elapsedTime * 2.5) * 0.012;
        }

        // 5. Update speech bubble position on screen
        this.updateSpeechPosition();

        this.renderer.render(this.scene, this.camera);
    }

    updateVehiclePhysics(delta)
    {
        if(!this.carGroup) return;

        const vs = this.vehicleState;
        const inp = this.input;

        // Acceleration / Deceleration
        const targetSpeed = inp.forward * vs.maxSpeed * (inp.boost ? 1.6 : 1.0);
        if(Math.abs(targetSpeed) > 0.01)
        {
            vs.speed = THREE.MathUtils.lerp(vs.speed, targetSpeed, delta * vs.acceleration);
        }
        else
        {
            vs.speed = THREE.MathUtils.lerp(vs.speed, 0, delta * vs.deceleration);
        }

        // Steering
        if(Math.abs(vs.speed) > 0.08)
        {
            const reverseFactor = vs.speed < 0 ? -1 : 1;
            vs.heading += inp.turn * vs.turnSpeed * delta * reverseFactor;
        }

        // Steer front wheels visual angle
        vs.steerAngle = THREE.MathUtils.lerp(vs.steerAngle, inp.turn * 0.45, delta * 12);
        this.wheels.forEach(w => {
            if(w.isFront)
            {
                w.holder.rotation.y = vs.steerAngle;
            }
            // Spin tires
            w.tire.rotation.x += vs.speed * delta * 12;
        });

        // Translate Car
        const forwardVector = new THREE.Vector3(
            -Math.sin(vs.heading),
            0,
            -Math.cos(vs.heading)
        );
        vs.pos.addScaledVector(forwardVector, vs.speed * delta);

        // Keep car bounded reasonably on the stage
        vs.pos.x = THREE.MathUtils.clamp(vs.pos.x, -2.2, 2.2);
        vs.pos.z = THREE.MathUtils.clamp(vs.pos.z, -2.2, 2.2);

        this.carGroup.position.copy(vs.pos);
        this.carGroup.rotation.y = vs.heading;

        // Sound & Exhaust
        this.playEngineRumble(Math.abs(vs.speed));
        if(this.exhaustParticles)
        {
            this.exhaustParticles.visible = Math.abs(vs.speed) > 0.2;
            this.exhaustParticles.rotation.y += delta * 6;
        }
    }

    updatePinPhysics(delta)
    {
        if(!this.pins) return;
        this.pins.forEach(pin => {
            if(pin.userData.isKnocked)
            {
                // Drift position
                pin.position.x += pin.userData.vx;
                pin.position.z += pin.userData.vz;
                pin.userData.vx *= 0.94;
                pin.userData.vz *= 0.94;

                // Topple rotation
                pin.rotation.x += pin.userData.vRotX;
                pin.rotation.z += pin.userData.vRotZ;
                pin.userData.vRotX *= 0.92;
                pin.userData.vRotZ *= 0.92;

                // Gravity to ground
                if(pin.position.y > 0.04) pin.position.y -= delta * 0.5;
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new RealWorldPortfolioAR();
});
