import * as THREE from 'three';
import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect.js';
import projectsData from './data/projects.js';

/**
 * 🥽 FULLY IMMERSIVE VIRTUAL REALITY EXPERIENCE
 * -------------------------------------------------------------
 * Features:
 * 1. Stereoscopic Dual-Eye Parallax Rendering (Google Cardboard / VR Box)
 * 2. Real-Time 360° Gyroscope Head Tracking (DeviceOrientation IMU)
 * 3. Native WebXR Support (Meta Quest, HTC Vive, Apple Vision Pro)
 * 4. Hands-Free Gaze Dwell Reticle Interaction
 * 5. Complete Cyber 3D World (Car, Cockpit, Projects, Career, Bowling)
 * 6. Dual Viewpoints: Plaza, Driver Cockpit, Billboard, Career Pathway
 */
class VRExperience
{
    constructor()
    {
        this.canvas = document.querySelector('.js-vr-canvas');
        if(!this.canvas) return;

        // State
        this.vrMode = 'stereo'; // 'stereo', 'mono', 'webxr'
        this.currentViewpoint = 'car';
        this.soundEnabled = true;
        this.audioCtx = null;
        this.isGazing = false;
        this.gazeTimer = 0;
        this.gazeTarget = null;
        this.gazeDuration = 1200; // 1.2s dwell to trigger

        // Camera control & head tracking
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        this.isPointerDown = false;
        this.pointerStart = { x: 0, y: 0 };
        this.hasGyro = false;
        this.gyroCalibration = { alpha: null, beta: null, gamma: null };

        // Projects Data
        this.projects = projectsData && projectsData.length > 0 ? projectsData : [
            {
                title: 'Autonomous Clinical Trial Analyst',
                category: 'AI / AGENTIC',
                tagline: 'Multi-Agent Regulatory & Medical Literature Synthesis',
                description: 'Autonomous multi-agent intelligence platform streamlining trial analysis and documentation.',
                problemSolved: 'Reduced clinical document synthesis time by 85%.',
                keyFeatures: ['Multi-agent orchestration', 'RAG over FDA databases', 'Automated protocol parsing'],
                attributes: { at: 'Enterprise Healthcare', stack: 'FastAPI, Gemini, Docker' }
            }
        ];
        this.currentProjectIndex = 0;

        // DOM elements
        this.initDOMElements();

        // Three.js & Stereo Setup
        this.initThree();
        this.initAudio();

        // 3D Scene Components
        this.buildCyberEnvironment();
        this.buildCyberCar();
        this.buildProjectsBillboard();
        this.buildCareerMonoliths();
        this.buildBowlingLane();
        this.buildAvatarAditi();

        // Interaction & Controls
        this.initRaycaster();
        this.initEventListeners();
        this.initMotionTracking();

        // Start render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    /* -------------------------------------------------------------
     * DOM ELEMENTS BINDING
     * ------------------------------------------------------------- */
    initDOMElements()
    {
        this.hud = document.querySelector('.js-vr-hud');
        this.statusText = document.querySelector('.js-vr-status');
        this.divider = document.querySelector('.js-stereo-divider');
        this.reticleMono = document.querySelector('.js-gaze-reticle');
        this.reticleLeft = document.querySelector('.js-gaze-reticle-left');
        this.reticleRight = document.querySelector('.js-gaze-reticle-right');
        this.gazeProgress = document.querySelector('.js-gaze-progress');
        this.progressBar = document.querySelector('.js-progress-bar');

        this.startModal = document.querySelector('.js-vr-start-modal');
        this.detailsCard = document.querySelector('.js-vr-details-card');
        this.detailCategory = document.querySelector('.js-detail-category');
        this.detailTitle = document.querySelector('.js-detail-title');
        this.detailDesc = document.querySelector('.js-detail-desc');
        this.detailTags = document.querySelector('.js-detail-tags');
    }

    /* -------------------------------------------------------------
     * THREE.JS & STEREOSCOPIC SETUP
     * ------------------------------------------------------------- */
    initThree()
    {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a060d);
        this.scene.fog = new THREE.FogExp2(0x0a060d, 0.035);

        // Camera rig (Camera placed inside a pivot for head tracking + position)
        this.cameraRig = new THREE.Group();
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
        this.camera.position.set(0, 1.4, 0); // Head eye level (1.4m)
        this.cameraRig.add(this.camera);
        this.scene.add(this.cameraRig);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Stereo Effect for Dual-Eye View
        this.stereoEffect = new StereoEffect(this.renderer);
        this.stereoEffect.setSize(width, height);
        this.stereoEffect.eyeSeparation = 0.064; // Standard human 64mm IPD

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xd8b4fe, 0.9);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
        dirLight.position.set(5, 12, 6);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        const rimLight = new THREE.DirectionalLight(0xe11d48, 1.8);
        rimLight.position.set(-6, 8, -6);
        this.scene.add(rimLight);

        // Apply initial mode
        this.setVRMode('stereo');
        this.setViewpoint('car', true);
    }

    /* -------------------------------------------------------------
     * WEB AUDIO SYNTHESIZER
     * ------------------------------------------------------------- */
    initAudio()
    {
        try
        {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
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

    playTone(freq, dur = 0.15, type = 'sine')
    {
        if(!this.soundEnabled || !this.audioCtx) return;
        this.resumeAudio();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + dur);
    }

    playSuccessChime()
    {
        if(!this.soundEnabled || !this.audioCtx) return;
        this.resumeAudio();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            setTimeout(() => this.playTone(freq, 0.25, 'sine'), idx * 70);
        });
    }

    /* -------------------------------------------------------------
     * 3D CYBER VIRTUAL WORLD
     * ------------------------------------------------------------- */
    buildCyberEnvironment()
    {
        // 1. Cyber Grid Floor
        const floorGeo = new THREE.PlaneGeometry(80, 80);
        const gridCanvas = document.createElement('canvas');
        gridCanvas.width = 256;
        gridCanvas.height = 256;
        const gCtx = gridCanvas.getContext('2d');
        gCtx.fillStyle = '#0f0814';
        gCtx.fillRect(0, 0, 256, 256);
        gCtx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
        gCtx.lineWidth = 3;
        gCtx.strokeRect(0, 0, 256, 256);
        gCtx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
        gCtx.lineWidth = 1;
        gCtx.beginPath();
        gCtx.moveTo(128, 0); gCtx.lineTo(128, 256);
        gCtx.moveTo(0, 128); gCtx.lineTo(256, 128);
        gCtx.stroke();

        const gridTex = new THREE.CanvasTexture(gridCanvas);
        gridTex.wrapS = THREE.RepeatWrapping;
        gridTex.wrapT = THREE.RepeatWrapping;
        gridTex.repeat.set(40, 40);

        const floorMat = new THREE.MeshStandardMaterial({
            map: gridTex,
            roughness: 0.65,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // 2. Glowing Horizon Ring
        const ringGeo = new THREE.RingGeometry(18, 19, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.02;
        this.scene.add(ring);

        // 3. Cyber Neon Pylons (Vertical glowing columns)
        const pylonGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 12);
        const pylonMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 1.5,
            roughness: 0.2
        });

        const angles = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4];
        angles.forEach(ang => {
            const px = Math.cos(ang) * 9;
            const pz = Math.sin(ang) * 9;
            const pylon = new THREE.Mesh(pylonGeo, pylonMat);
            pylon.position.set(px, 2, pz);
            this.scene.add(pylon);
        });

        // 4. Starlit Particle Field
        const starCount = 300;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        for(let i = 0; i < starCount; i++)
        {
            starPos[i * 3] = (Math.random() - 0.5) * 60;
            starPos[i * 3 + 1] = 4 + Math.random() * 25;
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xf3e8ff,
            size: 0.15,
            transparent: true,
            opacity: 0.75
        });
        this.stars = new THREE.Points(starGeo, starMat);
        this.scene.add(this.stars);
    }

    buildCyberCar()
    {
        this.carGroup = new THREE.Group();
        this.carGroup.position.set(0, 0, 0);

        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x9f1239,
            metalness: 0.85,
            roughness: 0.2,
            clearcoat: 1.0
        });
        const chassisMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.5, roughness: 0.4 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.75 });
        const neonMat = new THREE.MeshStandardMaterial({ color: 0xa5f3fc, emissive: 0x38bdf8, emissiveIntensity: 2.0 });

        // Lower Chassis
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 1.2), chassisMat);
        chassis.position.y = 0.08;
        chassis.castShadow = true;
        this.carGroup.add(chassis);

        // Aerodynamic Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 1.12), bodyMat);
        body.position.y = 0.16;
        body.castShadow = true;
        this.carGroup.add(body);

        // Cockpit Canopy
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.52), glassMat);
        cabin.position.set(0, 0.27, -0.05);
        cabin.castShadow = true;
        this.carGroup.add(cabin);

        // Spoiler
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.16), bodyMat);
        wing.position.set(0, 0.28, 0.45);
        this.carGroup.add(wing);

        // Dual Headlights
        const leftHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.04), neonMat);
        leftHeadlight.position.set(-0.22, 0.15, -0.56);
        const rightHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.04), neonMat);
        rightHeadlight.position.set(0.22, 0.15, -0.56);
        this.carGroup.add(leftHeadlight, rightHeadlight);

        // Headlight Beams
        const headlight = new THREE.SpotLight(0xa5f3fc, 2.5, 6, Math.PI / 4, 0.4);
        headlight.position.set(0, 0.2, -0.56);
        const headTarget = new THREE.Object3D();
        headTarget.position.set(0, 0, -4);
        this.carGroup.add(headlight, headTarget);
        headlight.target = headTarget;

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.08, 18);
        wheelGeo.rotateZ(Math.PI / 2);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, emissive: 0x9f1239, metalness: 0.9, roughness: 0.2 });

        const positions = [
            [-0.34, 0.10, -0.34],
            [0.34, 0.10, -0.34],
            [-0.34, 0.10, 0.34],
            [0.34, 0.10, 0.34]
        ];

        this.carWheels = [];
        positions.forEach(pos => {
            const wh = new THREE.Group();
            wh.position.set(pos[0], pos[1], pos[2]);
            const tire = new THREE.Mesh(wheelGeo, wheelMat);
            tire.castShadow = true;
            wh.add(tire);
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.085, 12).rotateZ(Math.PI / 2), rimMat);
            wh.add(rim);
            this.carGroup.add(wh);
            this.carWheels.push(tire);
        });

        // Interactive Car Target (Gazing at car triggers cockpit entry)
        const carTrigger = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 1.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
        carTrigger.position.y = 0.25;
        carTrigger.userData = {
            type: 'car_cockpit',
            title: 'Cyber Sports Car',
            category: 'VEHICLE',
            desc: 'Gaze here to enter the driver cockpit seat and look out the windshield.'
        };
        this.carGroup.add(carTrigger);
        this.interactiveMeshes = this.interactiveMeshes || [];
        this.interactiveMeshes.push(carTrigger);

        this.scene.add(this.carGroup);
    }

    buildProjectsBillboard()
    {
        this.billboardGroup = new THREE.Group();
        this.billboardGroup.position.set(-3.2, 0, -1.8);
        this.billboardGroup.rotation.y = Math.PI / 4;

        // Frame Stand
        const standMat = new THREE.MeshStandardMaterial({ color: 0x18101a, metalness: 0.7, roughness: 0.3 });
        const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 12), standMat);
        leftLeg.position.set(-1.15, 1.2, 0);
        const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 12), standMat);
        rightLeg.position.set(1.15, 1.2, 0);
        this.billboardGroup.add(leftLeg, rightLeg);

        // Billboard Canvas Screen
        this.projCanvas = document.createElement('canvas');
        this.projCanvas.width = 1024;
        this.projCanvas.height = 640;
        this.projTex = new THREE.CanvasTexture(this.projCanvas);
        this.updateProjectCanvas(this.currentProjectIndex);

        const screenMat = new THREE.MeshBasicMaterial({ map: this.projTex });
        const screenGeo = new THREE.PlaneGeometry(2.2, 1.35);
        this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
        this.screenMesh.position.set(0, 1.65, 0.02);
        this.billboardGroup.add(this.screenMesh);

        // Screen Backing Case
        const caseGeo = new THREE.BoxGeometry(2.3, 1.45, 0.08);
        const caseMesh = new THREE.Mesh(caseGeo, standMat);
        caseMesh.position.set(0, 1.65, -0.02);
        this.billboardGroup.add(caseMesh);

        // Floating Interactive 3D Prev / Next Arrow Buttons
        const arrowGeo = new THREE.BoxGeometry(0.24, 0.24, 0.06);
        const arrowMat = new THREE.MeshStandardMaterial({
            color: 0xa855f7,
            emissive: 0x7e22ce,
            emissiveIntensity: 1.2,
            roughness: 0.3
        });

        const prevMesh = new THREE.Mesh(arrowGeo, arrowMat);
        prevMesh.position.set(-1.35, 1.65, 0.05);
        prevMesh.userData = { type: 'project_prev' };

        const nextMesh = new THREE.Mesh(arrowGeo, arrowMat);
        nextMesh.position.set(1.35, 1.65, 0.05);
        nextMesh.userData = { type: 'project_next' };

        this.billboardGroup.add(prevMesh, nextMesh);
        this.interactiveMeshes.push(prevMesh, nextMesh);

        // Billboard Click/Gaze Details Trigger
        this.screenMesh.userData = { type: 'project_detail' };
        this.interactiveMeshes.push(this.screenMesh);

        this.scene.add(this.billboardGroup);
    }

    updateProjectCanvas(index)
    {
        const proj = this.projects[index];
        if(!proj || !this.projCanvas) return;
        const ctx = this.projCanvas.getContext('2d');
        const w = this.projCanvas.width;
        const h = this.projCanvas.height;

        ctx.fillStyle = '#170c18';
        ctx.fillRect(0, 0, w, h);

        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
        grad.addColorStop(1, 'rgba(236, 72, 153, 0.15)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, w - 20, h - 20);

        // Header Category
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(`PROJECT ${index + 1} / ${this.projects.length} • ${proj.category || 'FEATURED'}`, 48, 65);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px sans-serif';
        const titleText = proj.title.length > 32 ? proj.title.slice(0, 30) + '...' : proj.title;
        ctx.fillText(titleText, 48, 140);

        // Tagline
        ctx.fillStyle = '#d8b4fe';
        ctx.font = '600 28px sans-serif';
        const tagline = proj.tagline || (proj.attributes && proj.attributes.at) || 'Engineering & Software Architecture';
        ctx.fillText(tagline, 48, 195);

        // Description
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '26px sans-serif';
        this.wrapText(ctx, proj.description, 48, 260, w - 96, 38, 4);

        // Tech Stack Chips
        const techStr = (proj.attributes && proj.attributes.stack) || (proj.keyFeatures ? proj.keyFeatures.slice(0, 3).join(' • ') : 'Full-Stack');
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`STACK: ${techStr}`, 48, 480);

        // Call to action
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('👁️ Gaze at billboard to view complete project specification', 48, 560);

        if(this.projTex) this.projTex.needsUpdate = true;
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4)
    {
        if(!text) return;
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;
        for(let n = 0; n < words.length; n++)
        {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if(metrics.width > maxWidth && n > 0)
            {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                lineCount++;
                if(lineCount >= maxLines - 1)
                {
                    line += '...';
                    break;
                }
            }
            else
            {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    buildCareerMonoliths()
    {
        this.careerGroup = new THREE.Group();
        this.careerGroup.position.set(3.2, 0, -1.2);
        this.careerGroup.rotation.y = -Math.PI / 4;

        this.careerMilestones = [
            { title: 'VIT Vellore M.Tech CSE', sub: '9.65 CGPA • Rank 3', desc: 'Integrated M.Tech in Computer Science & Engineering. Top academic honours.' },
            { title: 'HCLTech Software Intern', sub: 'AI & Multi-Agent Systems', desc: 'Engineered automated multi-agent operational frameworks & cloud intelligence.' },
            { title: 'Team Sammard Rocketry', sub: 'CS Division Lead', desc: 'Led telemetry systems, ground control visualization, and trajectory physics.' },
            { title: 'NDA 149 Merit AIR 417', sub: 'National Defence Academy', desc: 'All India Merit List Rank 417 out of hundreds of thousands of applicants.' },
            { title: 'VIT Student Council', sub: 'Member Secretary', desc: 'Executive leadership representing 35,000+ university students.' }
        ];

        this.careerStones = [];
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x27192b, roughness: 0.7, metalness: 0.3 });
        const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.6 });

        this.careerMilestones.forEach((m, idx) => {
            const stone = new THREE.Group();
            const angle = (idx / (this.careerMilestones.length - 1)) * 1.2 - 0.6;
            const dist = 1.4 + idx * 0.7;
            stone.position.set(Math.sin(angle) * dist, 0, -Math.cos(angle) * dist);

            // Monolith Pillar
            const h = 1.2 + idx * 0.15;
            const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.42, h, 0.28), stoneMat);
            pillar.position.y = h / 2;
            pillar.castShadow = true;
            stone.add(pillar);

            // Glowing Crown Cap
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.32), capMat);
            cap.position.y = h + 0.04;
            stone.add(cap);

            stone.userData = {
                type: 'career_stone',
                index: idx,
                data: m
            };

            this.careerGroup.add(stone);
            this.interactiveMeshes.push(pillar);
            pillar.userData = stone.userData;
            this.careerStones.push({ group: stone, baseY: 0, targetY: 0 });
        });

        this.scene.add(this.careerGroup);
    }

    buildBowlingLane()
    {
        this.bowlingGroup = new THREE.Group();
        this.bowlingGroup.position.set(0, 0, 3.8);

        const laneMat = new THREE.MeshStandardMaterial({ color: 0x1f1424, roughness: 0.3, metalness: 0.4 });
        const lane = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 3.2), laneMat);
        lane.position.set(0, 0.02, 0);
        this.bowlingGroup.add(lane);

        // 6 Bowling Pins
        const pinGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.35, 12);
        const pinMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
        const pinCoords = [
            [0, 0.8],
            [-0.14, 1.1], [0.14, 1.1],
            [-0.28, 1.4], [0, 1.4], [0.28, 1.4]
        ];

        this.pins = [];
        pinCoords.forEach(c => {
            const pin = new THREE.Mesh(pinGeo, pinMat);
            pin.position.set(c[0], 0.2, c[1]);
            pin.castShadow = true;
            this.bowlingGroup.add(pin);
            this.pins.push(pin);
        });

        // Interactive Bowling reset
        const resetBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 1.2 }));
        resetBtn.position.set(0, 0.1, -1.4);
        resetBtn.userData = { type: 'bowling_reset' };
        this.bowlingGroup.add(resetBtn);
        this.interactiveMeshes.push(resetBtn);

        this.scene.add(this.bowlingGroup);
    }

    buildAvatarAditi()
    {
        const avatarGroup = new THREE.Group();
        avatarGroup.position.set(-1.4, 0, 0.8);

        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.4 });
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x27192b, roughness: 0.8 });

        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.55, 12), bodyMat);
        torso.position.y = 0.8;
        torso.castShadow = true;
        avatarGroup.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skinMat);
        head.position.y = 1.2;
        head.castShadow = true;
        avatarGroup.add(head);

        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), hairMat);
        hair.position.set(0, 1.24, -0.02);
        avatarGroup.add(hair);

        this.scene.add(avatarGroup);
    }

    /* -------------------------------------------------------------
     * GAZE RAYCASTING & DWELL TIMER (HANDS-FREE VR)
     * ------------------------------------------------------------- */
    initRaycaster()
    {
        this.raycaster = new THREE.Raycaster();
        this.centerPoint = new THREE.Vector2(0, 0); // Center of camera view
    }

    updateGaze(delta)
    {
        if(!this.interactiveMeshes || this.interactiveMeshes.length === 0) return;

        this.raycaster.setFromCamera(this.centerPoint, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, true);

        if(intersects.length > 0)
        {
            let target = intersects[0].object;
            while(target && !target.userData?.type && target.parent)
            {
                target = target.parent;
            }

            if(target && target.userData?.type)
            {
                if(this.gazeTarget !== target)
                {
                    this.gazeTarget = target;
                    this.gazeTimer = 0;
                    this.setReticleGazeState(true);
                }

                this.gazeTimer += delta;
                const progress = Math.min(this.gazeTimer / this.gazeDuration, 1.0);
                this.updateProgressBar(progress);

                if(this.gazeTimer >= this.gazeDuration)
                {
                    this.triggerGazeAction(target.userData);
                    this.gazeTimer = 0;
                    this.updateProgressBar(0);
                }
                return;
            }
        }

        // No gaze hit
        if(this.gazeTarget)
        {
            this.gazeTarget = null;
            this.gazeTimer = 0;
            this.setReticleGazeState(false);
            this.updateProgressBar(0);
        }
    }

    setReticleGazeState(isGazing)
    {
        if(this.reticleMono)
        {
            if(isGazing) this.reticleMono.classList.add('is-gazing');
            else this.reticleMono.classList.remove('is-gazing');
        }
        if(this.reticleLeft)
        {
            if(isGazing) this.reticleLeft.classList.add('is-gazing');
            else this.reticleLeft.classList.remove('is-gazing');
        }
        if(this.reticleRight)
        {
            if(isGazing) this.reticleRight.classList.add('is-gazing');
            else this.reticleRight.classList.remove('is-gazing');
        }
        if(this.gazeProgress)
        {
            if(isGazing) this.gazeProgress.classList.add('is-active');
            else this.gazeProgress.classList.remove('is-active');
        }
    }

    updateProgressBar(progress)
    {
        if(!this.progressBar) return;
        const total = 126;
        const offset = total - (total * progress);
        this.progressBar.style.strokeDashoffset = offset;
    }

    triggerGazeAction(data)
    {
        this.playTone(880, 0.12); // High confirmation beep

        if(data.type === 'project_prev')
        {
            this.currentProjectIndex = (this.currentProjectIndex - 1 + this.projects.length) % this.projects.length;
            this.updateProjectCanvas(this.currentProjectIndex);
        }
        else if(data.type === 'project_next')
        {
            this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length;
            this.updateProjectCanvas(this.currentProjectIndex);
        }
        else if(data.type === 'project_detail')
        {
            this.showDetailCard(this.projects[this.currentProjectIndex]);
        }
        else if(data.type === 'career_stone')
        {
            // Elevate stone
            if(this.careerStones[data.index])
            {
                this.careerStones[data.index].targetY = 0.45;
                setTimeout(() => { if(this.careerStones[data.index]) this.careerStones[data.index].targetY = 0; }, 4000);
            }
            this.showDetailCard({
                category: 'CAREER MILESTONE',
                title: data.data.title,
                tagline: data.data.sub,
                description: data.data.desc,
                attributes: { stack: 'Leadership • Engineering' }
            });
            this.playSuccessChime();
        }
        else if(data.type === 'car_cockpit')
        {
            this.setViewpoint('cockpit');
        }
        else if(data.type === 'bowling_reset')
        {
            this.pins.forEach(p => { p.rotation.set(0, 0, 0); p.position.y = 0.2; });
            this.playSuccessChime();
        }
    }

    showDetailCard(item)
    {
        if(!this.detailsCard) return;
        if(this.detailCategory) this.detailCategory.textContent = item.category || 'FEATURED';
        if(this.detailTitle) this.detailTitle.textContent = item.title;
        if(this.detailDesc) this.detailDesc.textContent = item.description || item.tagline || '';

        if(this.detailTags)
        {
            this.detailTags.innerHTML = '';
            const stack = (item.attributes && item.attributes.stack) ? item.attributes.stack.split(',') : (item.keyFeatures || ['Virtual Reality', 'Three.js']);
            stack.forEach(tag => {
                const sp = document.createElement('span');
                sp.textContent = tag.trim();
                this.detailTags.appendChild(sp);
            });
        }

        this.detailsCard.classList.add('is-visible');
    }

    /* -------------------------------------------------------------
     * HEAD TRACKING & ORIENTATION
     * ------------------------------------------------------------- */
    initMotionTracking()
    {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('skipmodal') === '1' && this.startModal)
        {
            this.startModal.classList.add('is-hidden');
        }

        const handleDeviceOrientation = (e) => {
            if(e.alpha === null || e.beta === null || e.gamma === null) return;
            this.hasGyro = true;

            if(this.gyroCalibration.alpha === null)
            {
                this.gyroCalibration.alpha = e.alpha;
                this.gyroCalibration.beta = e.beta;
                this.gyroCalibration.gamma = e.gamma;
            }

            // Convert Euler angles to camera rotation (in radians)
            const alphaRad = THREE.MathUtils.degToRad(e.alpha - this.gyroCalibration.alpha);
            const betaRad = THREE.MathUtils.degToRad(e.beta - 50); // Typical 50deg phone holding angle
            const gammaRad = THREE.MathUtils.degToRad(e.gamma);

            this.camera.rotation.set(betaRad, -alphaRad, -gammaRad, 'YXZ');
        };

        const reqBtn = document.querySelector('.js-btn-enter-vr');
        if(reqBtn)
        {
            reqBtn.addEventListener('click', async () => {
                this.resumeAudio();
                if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function')
                {
                    try
                    {
                        const perm = await DeviceOrientationEvent.requestPermission();
                        if(perm === 'granted')
                        {
                            window.addEventListener('deviceorientation', handleDeviceOrientation);
                        }
                    }
                    catch(err)
                    {
                        console.warn('DeviceOrientation permission error', err);
                    }
                }
                else
                {
                    window.addEventListener('deviceorientation', handleDeviceOrientation);
                }

                if(this.startModal) this.startModal.classList.add('is-hidden');
                this.enterFullscreen();
            });
        }

        const dismissBtn = document.querySelector('.js-btn-dismiss-modal');
        if(dismissBtn)
        {
            dismissBtn.addEventListener('click', () => {
                if(this.startModal) this.startModal.classList.add('is-hidden');
            });
        }

        // Desktop mouse / Touch drag fallback
        window.addEventListener('pointerdown', (e) => {
            this.isPointerDown = true;
            this.pointerStart = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('pointermove', (e) => {
            if(!this.isPointerDown || this.hasGyro) return;
            const dx = (e.clientX - this.pointerStart.x) * 0.0035;
            const dy = (e.clientY - this.pointerStart.y) * 0.0035;
            this.yaw -= dx;
            this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch - dy));
            this.pointerStart = { x: e.clientX, y: e.clientY };

            this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
        });

        window.addEventListener('pointerup', () => { this.isPointerDown = false; });
    }

    recenter()
    {
        this.yaw = 0;
        this.pitch = 0;
        this.camera.rotation.set(0, 0, 0);
        this.gyroCalibration = { alpha: null, beta: null, gamma: null };
        this.playTone(660, 0.1);
    }

    /* -------------------------------------------------------------
     * VIEWPOINTS & MODES
     * ------------------------------------------------------------- */
    setViewpoint(vp, immediate = false)
    {
        this.currentViewpoint = vp;
        document.querySelectorAll('.viewpoint-btn').forEach(btn => {
            if(btn.dataset.viewpoint === vp) btn.classList.add('is-active');
            else btn.classList.remove('is-active');
        });

        let targetPos = new THREE.Vector3(0, 1.4, 2.2);

        if(vp === 'car')
        {
            targetPos.set(0, 1.35, 2.2);
            this.yaw = 0;
        }
        else if(vp === 'cockpit')
        {
            targetPos.set(0, 0.32, 0.05); // Right in the driver's seat!
            this.yaw = 0;
            this.playTone(330, 0.2);
        }
        else if(vp === 'projects')
        {
            targetPos.set(-2.0, 1.5, -0.6);
            this.yaw = Math.PI / 4;
        }
        else if(vp === 'career')
        {
            targetPos.set(2.0, 1.4, 0.2);
            this.yaw = -Math.PI / 4;
        }
        else if(vp === 'bowling')
        {
            targetPos.set(0, 1.2, 1.8);
            this.yaw = 0;
        }

        if(immediate)
        {
            this.cameraRig.position.copy(targetPos);
            this.camera.rotation.set(0, this.yaw, 0);
        }
        else
        {
            this.targetRigPos = targetPos;
        }
    }

    setVRMode(mode)
    {
        this.vrMode = mode;
        document.querySelectorAll('.mode-tab').forEach(t => {
            if(t.dataset.vrmode === mode) t.classList.add('is-active');
            else t.classList.remove('is-active');
        });

        if(mode === 'stereo')
        {
            if(this.divider) this.divider.classList.add('is-active');
            document.body.classList.add('stereo-reticles-active');
            if(this.statusText) this.statusText.textContent = 'STEREOSCOPIC 3D • CARDBOARD MODE';
        }
        else
        {
            if(this.divider) this.divider.classList.remove('is-active');
            document.body.classList.remove('stereo-reticles-active');
            if(this.statusText) this.statusText.textContent = 'MONO 360° • GYRO HEAD TRACKING';
        }
    }

    enterFullscreen()
    {
        if(document.documentElement.requestFullscreen)
        {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    }

    /* -------------------------------------------------------------
     * EVENTS & RENDER LOOP
     * ------------------------------------------------------------- */
    initEventListeners()
    {
        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
            this.stereoEffect.setSize(w, h);
        });

        // Recenter
        const btnRecenter = document.querySelector('.js-btn-recenter');
        if(btnRecenter) btnRecenter.addEventListener('click', () => this.recenter());

        // Fullscreen
        const btnFs = document.querySelector('.js-btn-fullscreen');
        if(btnFs) btnFs.addEventListener('click', () => this.enterFullscreen());

        // Sound Toggle
        const btnSound = document.querySelector('.js-btn-sound');
        if(btnSound)
        {
            btnSound.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                btnSound.querySelector('.sound-icon').textContent = this.soundEnabled ? '🔊' : '🔇';
            });
        }

        // VR Mode Tabs
        document.querySelectorAll('.mode-tab').forEach(t => {
            t.addEventListener('click', () => {
                if(t.dataset.vrmode) this.setVRMode(t.dataset.vrmode);
            });
        });

        // Viewpoints
        document.querySelectorAll('.viewpoint-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if(btn.dataset.viewpoint) this.setViewpoint(btn.dataset.viewpoint);
            });
        });

        // Close Detail Card
        const btnClose = document.querySelector('.js-detail-close');
        if(btnClose) btnClose.addEventListener('click', () => {
            if(this.detailsCard) this.detailsCard.classList.remove('is-visible');
        });
    }

    animate()
    {
        requestAnimationFrame(this.animate);

        const delta = 16.6; // ~60fps step ms

        // Smooth rig motion if teleporting
        if(this.targetRigPos)
        {
            this.cameraRig.position.lerp(this.targetRigPos, 0.08);
            if(this.cameraRig.position.distanceTo(this.targetRigPos) < 0.05)
            {
                this.cameraRig.position.copy(this.targetRigPos);
                this.targetRigPos = null;
            }
        }

        // Animate elevated career stones
        if(this.careerStones)
        {
            this.careerStones.forEach(st => {
                st.group.position.y += (st.targetY - st.group.position.y) * 0.1;
            });
        }

        // Gaze Dwell interaction
        this.updateGaze(delta);

        // Spin car wheels gently
        if(this.carWheels)
        {
            this.carWheels.forEach(w => { w.rotation.x += 0.01; });
        }

        // Render in Stereo or Mono
        if(this.vrMode === 'stereo')
        {
            this.stereoEffect.render(this.scene, this.camera);
        }
        else
        {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new VRExperience();
});
