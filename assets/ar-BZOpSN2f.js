import { f$ as j, v as y, j as Z, al as J, g0 as Q, ax as _, b5 as tt, b3 as V, G as E, dz as et, bf as B, dv as q, Q as R, i as w, fE as H, $ as b, B as v, q as st, aV as it, bm as L, aj as nt, aD as ot, as as at, bQ as rt, eW as ct, aZ as Y, bp as ht, aH as lt, fb as dt, a4 as ut, a1 as k } from "./projects-DEZFQUrs.js";
import { G as pt } from "./GLTFLoader-AzqANSg3.js";
class mt {
  constructor() {
    this.video = document.querySelector("#ar-camera-feed"), this.canvas = document.querySelector("#ar-canvas"), this.permissionBanner = document.querySelector("#ar-permission-banner"), this.speechBubble = document.querySelector("#ar-speech"), this.statusText = document.querySelector("#ar-status-text"), this.shutterFlash = document.querySelector("#shutter-flash"), this.strikeBanner = document.querySelector("#strike-banner"), this.soundBtn = document.querySelector("#btn-sound"), this.soundIcon = document.querySelector("#sound-icon"), this.holoModal = document.querySelector("#holo-modal"), this.careerModal = document.querySelector("#career-modal"), this.aboutModal = document.querySelector("#about-modal"), this.contactModal = document.querySelector("#contact-modal"), this.panelProjects = document.querySelector("#panel-projects"), this.panelCareer = document.querySelector("#panel-career"), this.panelArcade = document.querySelector("#panel-arcade"), this.virtualControls = document.querySelector("#virtual-controls"), this.projCounter = document.querySelector("#proj-counter"), this.soundEnabled = true, this.facingMode = "environment", this.stream = null, this.currentMode = "drive", this.currentProjectIndex = 0, this.projects = j && j.length > 0 ? j : [], this.pinsKnocked = 0, this.careerMilestones = [{ institution: "VIT Vellore", role: "Integrated M.Tech Computer Science & Engineering", highlight: "9.65 CGPA \u2022 Department Rank 3", date: "2021 \u2013 Present", color: 3718648, desc: "Pursuing dual B.Tech + M.Tech in CSE with academic excellence (Rank 3, 9.65 CGPA). Specialized in distributed systems, modern AI architectures, cryptography, and real-time computing.", skills: ["Distributed Systems", "Algorithms", "Machine Learning", "Computer Networks", "Cybersecurity"] }, { institution: "HCLTech", role: "Software & AI Intern (Enterprise Cloud Operations)", highlight: "Autonomous Incident Remediation & Azure", date: "2024", color: 14753096, desc: "Engineered multi-agent AI framework for automated Kubernetes cluster telemetry analysis, root-cause diagnosis, and incident self-healing across Microsoft Azure environments.", skills: ["Azure", "Kubernetes", "LangGraph", "FastAPI", "Prometheus", "Autonomous Agents"] }, { institution: "Team Sammard (Rocketry)", role: "CS Senior Core Lead", highlight: "ISRO CanSat & Suborbital Flight Telemetry", date: "2023 \u2013 2024", color: 16096779, desc: "Led ground station software engineering for suborbital rocket missions. Architected high-frequency RF telemetry parsing, real-time 3D flight orientation visualization, and fail-safe recovery logic.", skills: ["RF Telemetry", "PyQt5", "3D Trajectories", "Sensors / IMU", "Embedded Systems"] }, { institution: "National Defence Academy (NDA 149)", role: "Officer Selection Merit List", highlight: "AIR 417 (Girls Rank 53)", date: "2022", color: 1096065, desc: "Cleared the highly competitive National Defence Academy entrance and 5-day SSB interview with All India Rank 417 and Girls Rank 53 among hundreds of thousands of candidates.", skills: ["Leadership", "High-Pressure Decision Making", "Strategic Planning", "Discipline"] }, { institution: "VIT Student Council", role: "Member Secretary", highlight: "University Technical & Cultural Governance", date: "2023 \u2013 2024", color: 11032055, desc: "Elected Member Secretary representing thousands of students. Spearheaded technical hackathons, symposiums, and digital academic initiatives across the campus.", skills: ["Executive Management", "Event Strategy", "Public Speaking", "Cross-Team Coordination"] }, { institution: "St. Joseph's Convent", role: "Senior Secondary School", highlight: "95.4% \u2022 School Topper", date: "2020", color: 440020, desc: "Graduated as School Topper in CBSE Science & Mathematics with 95.4%, establishing a rigorous foundation in mathematics, physics, and computer science.", skills: ["Mathematics", "Physics", "Computer Science", "Academic Excellence"] }], this.vehicleState = { pos: new y(0, 0, 0.4), velocity: new y(0, 0, 0), heading: 0, speed: 0, maxSpeed: 2.8, boost: 1, acceleration: 3.5, deceleration: 3.2, turnSpeed: 2.6, steerAngle: 0 }, this.input = { forward: 0, turn: 0, boost: false, honk: false }, this.initAudio(), this.initThree(), this.initCamera(), this.initDOMListeners(), this.initTouchControls(), this.initDeviceOrientation(), this.initKeyboardControls();
    const t = new URLSearchParams(window.location.search).get("mode");
    t && ["drive", "projects", "career", "arcade", "about", "contact"].includes(t) && this.setMode(t, true);
  }
  initAudio() {
    try {
      const e = window.AudioContext || window.webkitAudioContext;
      e && (this.audioCtx = new e());
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }
  resumeAudio() {
    this.audioCtx && this.audioCtx.state === "suspended" && this.audioCtx.resume();
  }
  playEngineRumble(e) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.engineOsc || (this.engineOsc = this.audioCtx.createOscillator(), this.engineGain = this.audioCtx.createGain(), this.engineOsc.type = "sawtooth", this.engineOsc.frequency.setValueAtTime(65, this.audioCtx.currentTime), this.engineGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime), this.engineOsc.connect(this.engineGain), this.engineGain.connect(this.audioCtx.destination), this.engineOsc.start());
    const t = 65 + Math.min(e, 1.5) * 85;
    this.engineOsc.frequency.setTargetAtTime(t, this.audioCtx.currentTime, 0.1);
    const i = e > 0.05 ? 0.035 : 8e-3;
    this.engineGain.gain.setTargetAtTime(i, this.audioCtx.currentTime, 0.1);
  }
  playHonk() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();
    const e = this.audioCtx.currentTime, t = this.audioCtx.createOscillator(), i = this.audioCtx.createOscillator(), s = this.audioCtx.createGain();
    t.type = "triangle", i.type = "sawtooth", t.frequency.setValueAtTime(392, e), i.frequency.setValueAtTime(440, e), s.gain.setValueAtTime(0.18, e), s.gain.exponentialRampToValueAtTime(1e-3, e + 0.35), t.connect(s), i.connect(s), s.connect(this.audioCtx.destination), t.start(e), i.start(e), t.stop(e + 0.35), i.stop(e + 0.35), this.showSpeech("BEEP BEEP! \u{1F697}\u{1F4A8}");
  }
  playPinHit() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();
    const e = this.audioCtx.currentTime, t = this.audioCtx.createOscillator(), i = this.audioCtx.createGain();
    t.type = "square", t.frequency.setValueAtTime(260 + Math.random() * 120, e), t.frequency.exponentialRampToValueAtTime(80, e + 0.18), i.gain.setValueAtTime(0.25, e), i.gain.exponentialRampToValueAtTime(1e-3, e + 0.18), t.connect(i), i.connect(this.audioCtx.destination), t.start(e), t.stop(e + 0.18);
  }
  playStrikeChime() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio(), [523.25, 659.25, 783.99, 1046.5].forEach((t, i) => {
      const s = this.audioCtx.currentTime + i * 0.08, n = this.audioCtx.createOscillator(), o = this.audioCtx.createGain();
      n.type = "sine", n.frequency.setValueAtTime(t, s), o.gain.setValueAtTime(0.2, s), o.gain.exponentialRampToValueAtTime(1e-3, s + 0.4), n.connect(o), o.connect(this.audioCtx.destination), n.start(s), n.stop(s + 0.4);
    });
  }
  playTone(e = 440, t = 0.15) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();
    const i = this.audioCtx.currentTime, s = this.audioCtx.createOscillator(), n = this.audioCtx.createGain();
    s.type = "sine", s.frequency.setValueAtTime(e, i), n.gain.setValueAtTime(0.12, i), n.gain.exponentialRampToValueAtTime(1e-3, i + t), s.connect(n), n.connect(this.audioCtx.destination), s.start(i), s.stop(i + t);
  }
  async initCamera() {
    const e = new URLSearchParams(window.location.search);
    if (e.get("skipcam") === "1" || e.get("demo") === "1") {
      this.statusText && (this.statusText.textContent = "AR: 3D WORLD SIMULATION"), this.permissionBanner && this.permissionBanner.classList.add("is-hidden");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.statusText && (this.statusText.textContent = "AR: DESKTOP SIMULATION"), this.permissionBanner && this.permissionBanner.classList.add("is-hidden");
      return;
    }
    try {
      this.stream && this.stream.getTracks().forEach((i) => i.stop());
      const t = { video: { facingMode: { ideal: this.facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false };
      this.stream = await navigator.mediaDevices.getUserMedia(t), this.video.srcObject = this.stream, await this.video.play(), this.facingMode === "user" ? this.video.classList.add("is-front") : this.video.classList.remove("is-front"), this.permissionBanner && this.permissionBanner.classList.add("is-hidden"), this.statusText && (this.statusText.textContent = "AR: REAL-WORLD CAMERA \u2022 ACTIVE");
    } catch (t) {
      console.warn("Camera access fallback:", t), t.name === "NotAllowedError" && this.permissionBanner ? (this.statusText && (this.statusText.textContent = "CAMERA BLOCKED (CLICK TO ENABLE)"), this.permissionBanner.classList.remove("is-hidden")) : this.statusText && (this.statusText.textContent = "AR: 3D WORLD SIMULATION");
    }
  }
  flipCamera() {
    this.facingMode = this.facingMode === "environment" ? "user" : "environment", this.initCamera();
  }
  initThree() {
    const e = window.innerWidth, t = window.innerHeight;
    this.scene = new Z(), this.camera = new J(50, e / t, 0.1, 100), this.camera.position.set(0, 1.75, 3.4), this.camera.lookAt(0, 0.5, 0), this.renderer = new Q({ canvas: this.canvas, alpha: true, antialias: true, preserveDrawingBuffer: true }), this.renderer.setSize(e, t), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this.renderer.shadowMap.enabled = true, this.renderer.shadowMap.type = _;
    const i = new tt(16777215, 1.8);
    this.scene.add(i);
    const s = new V(16775149, 2.4);
    s.position.set(3, 5, 4), s.castShadow = true, s.shadow.mapSize.width = 1024, s.shadow.mapSize.height = 1024, this.scene.add(s);
    const n = new V(14753096, 1.2);
    n.position.set(-3, 2, -3), this.scene.add(n), this.anchor = new E(), this.anchor.position.set(0, 0, 0), this.scene.add(this.anchor), this.buildGroundShadowDisc(), this.buildDrivableCyberCar(), this.build3DProjectsBillboard(), this.build3DCareerStones(), this.buildArcadeBowlingAlley(), this.buildCyberGridFloor(), this.loadCharacter(), window.addEventListener("resize", () => this.onResize()), this.clock = new et(), this.animate();
  }
  buildGroundShadowDisc() {
    const e = new B(3.6, 3.6), t = document.createElement("canvas");
    t.width = 256, t.height = 256;
    const i = t.getContext("2d"), s = i.createRadialGradient(128, 128, 20, 128, 128, 124);
    s.addColorStop(0, "rgba(0, 0, 0, 0.65)"), s.addColorStop(0.5, "rgba(0, 0, 0, 0.28)"), s.addColorStop(1, "rgba(0, 0, 0, 0)"), i.fillStyle = s, i.fillRect(0, 0, 256, 256);
    const n = new q(t), o = new R({ map: n, transparent: true, depthWrite: false }), c = new w(e, o);
    c.rotation.x = -Math.PI / 2, c.position.y = 2e-3, this.anchor.add(c);
  }
  buildCyberGridFloor() {
    this.ringsGroup = new E(), this.anchor.add(this.ringsGroup);
    const e = new H(1.65, 0.015, 12, 64), t = new b({ color: 14753096, emissive: 10424889, roughness: 0.3, metalness: 0.8 });
    this.outerRing = new w(e, t), this.outerRing.rotation.x = Math.PI / 2, this.outerRing.position.y = 0.01, this.ringsGroup.add(this.outerRing);
    const i = new H(1.15, 0.01, 12, 48), s = new b({ color: 3718648, emissive: 165063, roughness: 0.3, metalness: 0.6 });
    this.innerRing = new w(i, s), this.innerRing.rotation.x = Math.PI / 2, this.innerRing.position.y = 0.012, this.ringsGroup.add(this.innerRing);
  }
  buildDrivableCyberCar() {
    this.carGroup = new E(), this.carGroup.position.copy(this.vehicleState.pos), this.anchor.add(this.carGroup);
    const e = new b({ color: 14753096, metalness: 0.85, roughness: 0.22, clearcoat: 0.8, clearcoatRoughness: 0.15 }), t = new b({ color: 1120295, metalness: 0.6, roughness: 0.4 }), i = new b({ color: 988970, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.75 }), s = new b({ color: 3718648, emissive: 959977, emissiveIntensity: 1.5, roughness: 0.2 }), n = new v(0.56, 0.07, 0.95), o = new w(n, t);
    o.position.y = 0.08, o.castShadow = true, this.carGroup.add(o);
    const c = new v(0.52, 0.11, 0.86), a = new w(c, e);
    a.position.y = 0.16, a.castShadow = true, this.carGroup.add(a);
    const l = new v(0.42, 0.1, 0.42), m = new w(l, i);
    m.position.set(0, 0.245, -0.05), m.castShadow = true, this.carGroup.add(m);
    const r = new v(0.48, 0.025, 0.14), f = new w(r, e);
    f.position.set(0, 0.25, 0.36), this.carGroup.add(f);
    const p = new v(0.04, 0.09, 0.04), u = new w(p, t);
    u.position.set(-0.16, 0.19, 0.36);
    const d = new w(p, t);
    d.position.set(0.16, 0.19, 0.36), this.carGroup.add(u, d);
    const g = new v(0.12, 0.035, 0.04), h = new w(g, s);
    h.position.set(-0.19, 0.14, -0.44);
    const x = new w(g, s);
    x.position.set(0.19, 0.14, -0.44), this.carGroup.add(h, x), this.carSpotlight = new st(10875900, 2.5, 3.5, Math.PI / 4, 0.5), this.carSpotlight.position.set(0, 0.18, -0.45);
    const S = new it();
    S.position.set(0, 0, -2.5), this.carGroup.add(this.carSpotlight), this.carGroup.add(S), this.carSpotlight.target = S;
    const M = new b({ color: 16711731, emissive: 16711731, emissiveIntensity: 1.2 }), T = new v(0.14, 0.03, 0.03), A = new w(T, M);
    A.position.set(-0.18, 0.16, 0.44);
    const I = new w(T, M);
    I.position.set(0.18, 0.16, 0.44), this.carGroup.add(A, I), this.wheels = [];
    const N = [{ x: -0.28, y: 0.075, z: -0.28, isFront: true }, { x: 0.28, y: 0.075, z: -0.28, isFront: true }, { x: -0.28, y: 0.075, z: 0.28, isFront: false }, { x: 0.28, y: 0.075, z: 0.28, isFront: false }], X = new b({ color: 1579035, roughness: 0.8, metalness: 0.2 }), K = new b({ color: 14753096, emissive: 10424889, metalness: 0.8, roughness: 0.2 });
    N.forEach((C) => {
      const P = new E();
      P.position.set(C.x, C.y, C.z);
      const W = new L(0.08, 0.08, 0.065, 18);
      W.rotateZ(Math.PI / 2);
      const G = new w(W, X);
      G.castShadow = true, P.add(G);
      const F = new L(0.045, 0.045, 0.068, 12);
      F.rotateZ(Math.PI / 2);
      const $ = new w(F, K);
      P.add($), this.carGroup.add(P), this.wheels.push({ holder: P, tire: G, isFront: C.isFront });
    });
    const O = 30, z = new nt(), D = new Float32Array(O * 3);
    for (let C = 0; C < O; C++) D[C * 3 + 0] = (Math.random() - 0.5) * 0.1, D[C * 3 + 1] = 0.05 + Math.random() * 0.08, D[C * 3 + 2] = 0.45 + Math.random() * 0.3;
    z.setAttribute("position", new ot(D, 3));
    const U = new at({ color: 3718648, size: 0.03, transparent: true, opacity: 0.6, blending: rt });
    this.exhaustParticles = new ct(z, U), this.carGroup.add(this.exhaustParticles);
  }
  build3DProjectsBillboard() {
    this.billboardGroup = new E(), this.billboardGroup.position.set(-1.15, 0, -0.6), this.billboardGroup.rotation.y = 0.38, this.anchor.add(this.billboardGroup);
    const e = new b({ color: 1971494, metalness: 0.8, roughness: 0.3 }), t = new L(0.04, 0.05, 1.25, 16), i = new w(t, e);
    i.position.set(-0.78, 0.625, 0), i.castShadow = true;
    const s = new w(t, e);
    s.position.set(0.78, 0.625, 0), s.castShadow = true, this.billboardGroup.add(i, s);
    const n = new v(0.24, 0.06, 0.24), o = new w(n, e);
    o.position.set(-0.78, 0.03, 0);
    const c = new w(n, e);
    c.position.set(0.78, 0.03, 0), this.billboardGroup.add(o, c);
    const a = new v(1.68, 0.08, 0.08), l = new w(a, e);
    l.position.set(0, 1.26, 0), this.billboardGroup.add(l);
    const m = new b({ color: 14753096, emissive: 12456508, roughness: 0.2, metalness: 0.7 }), r = new v(1.54, 0.86, 0.03), f = new w(r, m);
    f.position.set(0, 0.78, -0.015), this.billboardGroup.add(f), this.screenCanvas = document.createElement("canvas"), this.screenCanvas.width = 1024, this.screenCanvas.height = 576, this.screenCtx = this.screenCanvas.getContext("2d"), this.screenTexture = new q(this.screenCanvas), this.screenTexture.colorSpace = Y;
    const p = new B(1.48, 0.8), u = new R({ map: this.screenTexture, transparent: false });
    this.screenMesh = new w(p, u), this.screenMesh.position.set(0, 0.78, 0.015), this.screenMesh.userData = { isScreen: true }, this.billboardGroup.add(this.screenMesh);
    const d = new v(0.12, 0.18, 0.05), g = new b({ color: 3718648, emissive: 165063, roughness: 0.2 });
    this.prev3DBtn = new w(d, g), this.prev3DBtn.position.set(-0.88, 0.78, 0.02), this.prev3DBtn.userData = { isPrevBtn: true }, this.next3DBtn = new w(d, g), this.next3DBtn.position.set(0.88, 0.78, 0.02), this.next3DBtn.userData = { isNextBtn: true }, this.billboardGroup.add(this.prev3DBtn, this.next3DBtn), this.updateBillboardSlide();
  }
  updateBillboardSlide() {
    const e = this.projects[this.currentProjectIndex];
    if (!e || !this.screenCtx) return;
    const t = this.screenCtx, i = 1024, s = 576, n = t.createLinearGradient(0, 0, i, s);
    n.addColorStop(0, "#1a0b1d"), n.addColorStop(0.5, "#26102a"), n.addColorStop(1, "#110714"), t.fillStyle = n, t.fillRect(0, 0, i, s), t.strokeStyle = "rgba(225, 29, 72, 0.12)", t.lineWidth = 1;
    for (let r = 0; r < i; r += 64) t.beginPath(), t.moveTo(r, 0), t.lineTo(r, s), t.stroke();
    for (let r = 0; r < s; r += 64) t.beginPath(), t.moveTo(0, r), t.lineTo(i, r), t.stroke();
    t.fillStyle = "#e11d48", t.fillRect(40, 36, i - 80, 4), t.fillStyle = "#ff6b81", t.font = "bold 22px -apple-system, sans-serif", t.fillText(e.category ? e.category.toUpperCase() : "ENGINEERING PROJECT", 46, 76), t.fillStyle = "#94a3b8", t.font = "bold 20px -apple-system, sans-serif", t.textAlign = "right", t.fillText(`PROJECT ${this.currentProjectIndex + 1} OF ${this.projects.length}`, i - 46, 76), t.textAlign = "left", t.fillStyle = "#ffffff", t.font = "bold 44px -apple-system, sans-serif", t.fillText(e.title, 46, 136), t.fillStyle = "#38bdf8", t.font = "bold 22px -apple-system, sans-serif";
    const o = e.tagline || e.attributes && e.attributes.at || "Full-Stack & Security Architecture";
    t.fillText(o, 46, 176), t.fillStyle = "#e2e8f0", t.font = "22px -apple-system, sans-serif";
    const c = e.description.split(" ");
    let a = "", l = 228;
    const m = i - 100;
    for (let r = 0; r < c.length; r++) {
      const f = a + c[r] + " ";
      if (t.measureText(f).width > m && r > 0) {
        if (t.fillText(a, 46, l), a = c[r] + " ", l += 32, l > 350) {
          a += "...";
          break;
        }
      } else a = f;
    }
    if (t.fillText(a, 46, l), e.techStack) {
      let r = 46;
      const f = 400;
      e.techStack.slice(0, 5).forEach((p) => {
        t.font = "bold 18px -apple-system, sans-serif";
        const d = t.measureText(p).width + 24;
        t.fillStyle = "rgba(255, 255, 255, 0.12)", t.beginPath(), t.roundRect(r, f, d, 34, 10), t.fill(), t.strokeStyle = "rgba(255, 255, 255, 0.25)", t.lineWidth = 1.5, t.stroke(), t.fillStyle = "#ffffff", t.fillText(p, r + 12, f + 23), r += d + 12;
      });
    }
    t.fillStyle = "#e11d48", t.beginPath(), t.roundRect(46, 474, 380, 54, 18), t.fill(), t.fillStyle = "#ffffff", t.font = "bold 22px -apple-system, sans-serif", t.fillText("\u{1F50D} TAP TO VIEW DETAILS & REPO", 66, 509), this.screenTexture.needsUpdate = true, this.projCounter && (this.projCounter.textContent = `${this.currentProjectIndex + 1} / ${this.projects.length}`);
  }
  nextProject() {
    this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length, this.updateBillboardSlide(), this.playTone(587, 0.1);
  }
  prevProject() {
    this.currentProjectIndex = (this.currentProjectIndex - 1 + this.projects.length) % this.projects.length, this.updateBillboardSlide(), this.playTone(493, 0.1);
  }
  build3DCareerStones() {
    this.careerGroup = new E(), this.careerGroup.position.set(1.1, 0, -0.4), this.careerGroup.rotation.y = -0.35, this.anchor.add(this.careerGroup), this.stones = [];
    const e = new v(0.36, 0.52, 0.12);
    this.careerMilestones.forEach((t, i) => {
      const s = new E(), n = i / this.careerMilestones.length * Math.PI * 0.9, o = 0.55 + i * 0.18;
      s.position.set(Math.cos(n) * o - 0.2, 0.26, Math.sin(n) * o - 0.3), s.rotation.y = -n * 0.4;
      const c = new b({ color: 1774370, roughness: 0.6, metalness: 0.4 }), a = new w(e, c);
      a.castShadow = true, s.add(a);
      const l = new b({ color: t.color, emissive: t.color, emissiveIntensity: 0.8, roughness: 0.3 }), m = new v(0.38, 0.04, 0.13), r = new w(m, l);
      r.position.y = 0.25, s.add(r);
      const f = document.createElement("canvas");
      f.width = 256, f.height = 256;
      const p = f.getContext("2d");
      p.fillStyle = "#1b1322", p.fillRect(0, 0, 256, 256), p.fillStyle = "#ffffff", p.font = "bold 26px -apple-system, sans-serif", p.textAlign = "center", p.fillText(t.institution.toUpperCase(), 128, 90), p.fillStyle = "#38bdf8", p.font = "bold 18px -apple-system, sans-serif", p.fillText(t.date, 128, 140), p.fillStyle = "#e2e8f0", p.font = "16px -apple-system, sans-serif", p.fillText(t.highlight.substring(0, 22), 128, 180);
      const u = new q(f);
      u.colorSpace = Y;
      const d = new B(0.32, 0.32), g = new R({ map: u }), h = new w(d, g);
      h.position.set(0, 0, 0.062), s.add(h), s.userData = { milestoneIndex: i, mesh: a, baseElevation: 0.26 }, this.careerGroup.add(s), this.stones.push(s);
    });
  }
  elevateCareerStone(e) {
    const t = this.careerMilestones[e], i = this.stones[e];
    if (!t || !i) return;
    this.playTone(330, 0.2);
    const s = i.position.y, n = i.userData.baseElevation + 0.18, o = 0.35, c = this.clock.getElapsedTime(), a = () => {
      const l = this.clock.getElapsedTime() - c;
      if (l < o) {
        const m = l / o;
        i.position.y = k.lerp(s, n, m), requestAnimationFrame(a);
      } else i.position.y = n;
    };
    a(), this.openCareerModal(e);
  }
  buildArcadeBowlingAlley() {
    this.bowlingGroup = new E(), this.bowlingGroup.position.set(0.15, 0, -1.25), this.anchor.add(this.bowlingGroup), this.pins = [], this.pinsKnocked = 0;
    const e = [{ x: -0.16, z: 0.16 }, { x: 0, z: 0.16 }, { x: 0.16, z: 0.16 }, { x: -0.08, z: 0 }, { x: 0.08, z: 0 }, { x: 0, z: -0.16 }], t = new L(0.024, 0.042, 0.22, 14), i = new ht(0.035, 12, 10), s = new b({ color: 16317180, roughness: 0.2, metalness: 0.1 }), n = new R({ color: 14753096 });
    e.forEach((o, c) => {
      const a = new E();
      a.position.set(o.x, 0.11, o.z);
      const l = new w(t, s);
      l.castShadow = true, a.add(l);
      const m = new w(i, s);
      m.position.y = 0.11, a.add(m);
      const r = new w(new L(0.028, 0.028, 0.03, 14), n);
      r.position.y = 0.06, a.add(r), a.userData = { index: c, initialPos: new y(o.x, 0.11, o.z), initialRot: new lt(0, 0, 0), isKnocked: false, vx: 0, vz: 0, vRotX: 0, vRotZ: 0 }, this.bowlingGroup.add(a), this.pins.push(a);
    });
  }
  resetBowlingPins() {
    this.pinsKnocked = 0, this.pins.forEach((t) => {
      t.userData.isKnocked = false, t.userData.vx = 0, t.userData.vz = 0, t.userData.vRotX = 0, t.userData.vRotZ = 0, t.position.copy(t.userData.initialPos), t.rotation.set(0, 0, 0);
    });
    const e = document.querySelector("#bowling-score");
    e && (e.textContent = "Drive car into pins! \u{1F3B3}"), this.showSpeech("Pins reset! Ready to bowl! \u{1F3B3}\u2728"), this.playTone(440, 0.15);
  }
  checkCarBowlingCollisions() {
    if (!this.carGroup || !this.pins) return;
    const e = new y();
    this.carGroup.getWorldPosition(e);
    const t = new y();
    this.bowlingGroup.getWorldPosition(t);
    const i = this.vehicleState.speed;
    let s = 0;
    if (this.pins.forEach((n) => {
      if (n.userData.isKnocked) return;
      const o = new y();
      if (n.getWorldPosition(o), e.distanceTo(o) < 0.28) {
        n.userData.isKnocked = true, this.pinsKnocked++, s++;
        const a = Math.max(i, 1.2), l = this.vehicleState.heading;
        n.userData.vx = -Math.sin(l) * a * 0.08 + (Math.random() - 0.5) * 0.04, n.userData.vz = -Math.cos(l) * a * 0.08 + (Math.random() - 0.5) * 0.04, n.userData.vRotX = (Math.random() - 0.5) * 0.4, n.userData.vRotZ = (Math.random() - 0.5) * 0.4, this.playPinHit();
      }
    }), s > 0) {
      const n = document.querySelector("#bowling-score");
      n && (n.textContent = `Pins: ${this.pinsKnocked} / 6 Knocked!`), this.pinsKnocked === 6 && this.triggerStrike();
    }
  }
  triggerStrike() {
    this.playStrikeChime(), this.showSpeech("STRIKE!! YOU ARE A LEGEND! \u{1F3B3}\u{1F389}"), this.strikeBanner && (this.strikeBanner.classList.add("is-visible"), setTimeout(() => {
      this.strikeBanner.classList.remove("is-visible");
    }, 2400));
  }
  loadCharacter() {
    new pt().load("ar/aditi-avatar.glb", (t) => {
      this.character = t.scene, this.character.position.set(0.68, 0, 0.15), this.character.rotation.y = Math.PI * 0.9, this.character.scale.set(0.65, 0.65, 0.65), this.anchor.add(this.character), this.jumpCharacter("Welcome to my AR Portfolio! \u{1F697}\u{1F4A8}");
    }, void 0, (t) => {
      console.error("Error loading AR avatar:", t);
    });
  }
  jumpCharacter(e = null) {
    if (!this.character) return;
    const t = this.character.position.y, i = 0.4, s = this.clock.getElapsedTime(), n = () => {
      const o = this.clock.getElapsedTime() - s;
      if (o < i) {
        const c = o / i, a = Math.sin(c * Math.PI);
        this.character.position.y = t + a * 0.25, this.character.rotation.y += 0.08, requestAnimationFrame(n);
      } else this.character.position.y = t;
    };
    n(), e && this.showSpeech(e);
  }
  showSpeech(e) {
    this.speechBubble && (this.speechBubble.textContent = e, this.speechBubble.classList.add("is-visible"), this.updateSpeechPosition(), clearTimeout(this.speechTimeout), this.speechTimeout = setTimeout(() => {
      this.speechBubble.classList.remove("is-visible");
    }, 3400));
  }
  updateSpeechPosition() {
    if (!this.speechBubble || !this.anchor) return;
    const t = new y(0, 1.6, 0).applyMatrix4(this.anchor.matrixWorld).clone().project(this.camera), i = (t.x * 0.5 + 0.5) * window.innerWidth, s = (-(t.y * 0.5) + 0.5) * window.innerHeight - 30;
    this.speechBubble.style.left = `${i}px`, this.speechBubble.style.top = `${s}px`, this.speechBubble.style.transform = "translate(-50%, -100%)";
  }
  takeSnapshot() {
    this.shutterFlash && (this.shutterFlash.classList.add("is-flashing"), setTimeout(() => {
      this.shutterFlash.classList.remove("is-flashing");
    }, 180));
    const e = this.canvas.width, t = this.canvas.height, i = document.createElement("canvas");
    i.width = e, i.height = t;
    const s = i.getContext("2d");
    if (this.video && this.video.readyState >= 2) {
      const c = this.video.videoWidth, a = this.video.videoHeight, l = c / a, m = e / t;
      let r = 0, f = 0, p = c, u = a;
      l > m ? (p = a * m, r = (c - p) / 2) : (u = c / m, f = (a - u) / 2), this.facingMode === "user" ? (s.save(), s.scale(-1, 1), s.drawImage(this.video, r, f, p, u, -e, 0, e, t), s.restore()) : s.drawImage(this.video, r, f, p, u, 0, 0, e, t);
    } else s.fillStyle = "#170d18", s.fillRect(0, 0, e, t);
    s.drawImage(this.canvas, 0, 0, e, t), s.fillStyle = "rgba(0, 0, 0, 0.65)", s.roundRect(24, t - 60, 310, 36, 18), s.fill(), s.fillStyle = "#ffffff", s.font = "bold 15px -apple-system, sans-serif", s.fillText("Aditi Sharma \u2022 3D Portfolio AR", 40, t - 37);
    const n = i.toDataURL("image/jpeg", 0.95), o = document.createElement("a");
    o.download = `aditi-ar-portfolio-${Date.now()}.jpg`, o.href = n, o.click(), this.showSpeech("Saved AR Photo to device! \u{1F4F8}\u2728");
  }
  initDOMListeners() {
    this.soundBtn && this.soundBtn.addEventListener("click", () => {
      this.soundEnabled = !this.soundEnabled, this.soundIcon.textContent = this.soundEnabled ? "\u{1F50A}" : "\u{1F507}", this.showSpeech(this.soundEnabled ? "Sound Enabled \u{1F50A}" : "Sound Muted \u{1F507}");
    });
    const e = document.querySelector("#btn-recenter");
    e && e.addEventListener("click", () => {
      this.anchor.position.set(0, 0, 0), this.anchor.scale.set(1, 1, 1), this.anchor.rotation.set(0, 0, 0), this.vehicleState.pos.set(0, 0, 0.4), this.vehicleState.heading = 0, this.vehicleState.speed = 0, this.camera.position.set(0, 1.75, 3.4), this.camera.lookAt(0, 0.5, 0), this.showSpeech("Recentered AR World! \u{1F3AF}");
    });
    const t = document.querySelector("#btn-start-camera");
    t && t.addEventListener("click", () => this.initCamera());
    const i = document.querySelector("#btn-skip-camera");
    i && i.addEventListener("click", () => {
      this.permissionBanner && this.permissionBanner.classList.add("is-hidden"), this.statusText && (this.statusText.textContent = "AR: 3D WORLD SIMULATION"), this.showSpeech("Welcome to the AR World! \u{1F697}\u2728");
    });
    const s = document.querySelector("#btn-flip-cam");
    s && s.addEventListener("click", () => this.flipCamera());
    const n = document.querySelector("#btn-snapshot");
    n && n.addEventListener("click", () => this.takeSnapshot());
    const o = document.querySelector("#btn-pose");
    o && o.addEventListener("click", () => this.jumpCharacter("Level Up! \u{1F31F} 2500 CP"));
    const c = document.querySelector("#btn-profile-card");
    c && c.addEventListener("click", () => this.openAboutModal()), document.querySelectorAll(".mode-tab").forEach((h) => {
      h.addEventListener("click", () => {
        const x = h.dataset.mode;
        this.setMode(x);
      });
    });
    const a = document.querySelector("#btn-proj-prev");
    a && a.addEventListener("click", () => this.prevProject());
    const l = document.querySelector("#btn-proj-next");
    l && l.addEventListener("click", () => this.nextProject());
    const m = document.querySelector("#btn-proj-inspect");
    m && m.addEventListener("click", () => this.openProjectModal(this.currentProjectIndex)), document.querySelectorAll(".career-chip").forEach((h) => {
      h.addEventListener("click", () => {
        const x = parseInt(h.dataset.career, 10);
        this.elevateCareerStone(x);
      });
    });
    const r = document.querySelector("#btn-reset-pins");
    r && r.addEventListener("click", () => this.resetBowlingPins());
    const f = document.querySelector("#btn-aim-bowling");
    f && f.addEventListener("click", () => {
      this.vehicleState.pos.set(0.15, 0, -0.4), this.vehicleState.heading = Math.PI, this.vehicleState.speed = 0, this.showSpeech("Aimed at bowling alley! Hit gas! \u{1F3B3}\u{1F697}");
    });
    const p = document.querySelector("#btn-modal-close");
    p && p.addEventListener("click", () => this.closeProjectModal());
    const u = document.querySelector("#btn-career-close");
    u && u.addEventListener("click", () => this.closeCareerModal());
    const d = document.querySelector("#btn-about-close");
    d && d.addEventListener("click", () => this.closeAboutModal());
    const g = document.querySelector("#btn-contact-close");
    g && g.addEventListener("click", () => this.closeContactModal()), this.initVirtualDrivePad();
  }
  setMode(e, t = false) {
    this.currentMode = e, this.playTone(523, 0.08), document.querySelectorAll(".mode-tab").forEach((i) => {
      i.dataset.mode === e ? i.classList.add("is-active") : i.classList.remove("is-active");
    }), this.panelProjects && this.panelProjects.classList.remove("is-active"), this.panelCareer && this.panelCareer.classList.remove("is-active"), this.panelArcade && this.panelArcade.classList.remove("is-active"), this.virtualControls && this.virtualControls.classList.add("is-hidden"), e === "drive" ? (this.virtualControls && this.virtualControls.classList.remove("is-hidden"), this.statusText && (this.statusText.textContent = "AR: DRIVE MODE \u2022 STEER & GAS ON FLOOR"), this.showSpeech("Drive around your room! \u{1F697}\u{1F4A8}"), this.focusCameraOn(new y(0, 1.75, 3.4), new y(0, 0.5, 0), t)) : e === "projects" ? (this.panelProjects && this.panelProjects.classList.add("is-active"), this.statusText && (this.statusText.textContent = "AR: 3D BILLBOARD \u2022 PROJECTS SHOWCASE"), this.showSpeech("Explore my engineering projects! \u{1F4C2}\u2728"), this.focusCameraOn(new y(-1.15, 0.9, 1.55), new y(-1.15, 0.75, -0.6), t)) : e === "career" ? (this.panelCareer && this.panelCareer.classList.add("is-active"), this.statusText && (this.statusText.textContent = "AR: CAREER STONES \u2022 TIMELINE"), this.showSpeech("Tap the stones to see my career milestones! \u{1F4BC}"), this.focusCameraOn(new y(1.1, 1.35, 1.6), new y(1.1, 0.45, -0.4), t)) : e === "arcade" ? (this.panelArcade && this.panelArcade.classList.add("is-active"), this.virtualControls && this.virtualControls.classList.remove("is-hidden"), this.statusText && (this.statusText.textContent = "AR: BOWLING ALLEY \u2022 KNOCK DOWN PINS!"), this.showSpeech("Drive into the pins for a strike! \u{1F3B3}"), this.focusCameraOn(new y(0.15, 1.45, 0.7), new y(0.15, 0.2, -1.25), t)) : e === "about" ? this.openAboutModal() : e === "contact" && this.openContactModal();
  }
  focusCameraOn(e, t, i = false) {
    if (i) {
      this.camera.position.copy(e), this.camera.lookAt(t);
      return;
    }
    const s = this.camera.position.clone(), n = 0.6, o = this.clock.getElapsedTime(), c = () => {
      const a = this.clock.getElapsedTime() - o;
      if (a < n) {
        const l = a / n;
        this.camera.position.lerpVectors(s, e, l), this.camera.lookAt(t), requestAnimationFrame(c);
      } else this.camera.position.copy(e), this.camera.lookAt(t);
    };
    c();
  }
  initVirtualDrivePad() {
    const e = document.querySelector("#joystick-zone"), t = document.querySelector("#joystick-stick");
    let i = false, s = 0, n = 0;
    const o = 42;
    if (e && t) {
      const r = (u) => {
        i = true;
        const d = e.getBoundingClientRect();
        s = d.left + d.width / 2, n = d.top + d.height / 2, f(u);
      }, f = (u) => {
        if (!i) return;
        const d = u.touches ? u.touches[0] : u, g = d.clientX - s, h = d.clientY - n, x = Math.hypot(g, h), S = Math.atan2(h, g), M = Math.min(x, o), T = Math.cos(S) * M, A = Math.sin(S) * M;
        t.style.transform = `translate(calc(-50% + ${T}px), calc(-50% + ${A}px))`, this.input.forward = -A / o, this.input.turn = -T / o;
      }, p = () => {
        i = false, t.style.transform = "translate(-50%, -50%)", this.input.forward = 0, this.input.turn = 0;
      };
      e.addEventListener("touchstart", r, { passive: true }), e.addEventListener("touchmove", f, { passive: true }), e.addEventListener("touchend", p);
    }
    const c = document.querySelector("#btn-gas");
    c && (c.addEventListener("touchstart", (r) => {
      r.preventDefault(), this.input.forward = 1;
    }), c.addEventListener("touchend", () => {
      this.input.forward = 0;
    }), c.addEventListener("mousedown", () => {
      this.input.forward = 1;
    }), c.addEventListener("mouseup", () => {
      this.input.forward = 0;
    }));
    const a = document.querySelector("#btn-reverse");
    a && (a.addEventListener("touchstart", (r) => {
      r.preventDefault(), this.input.forward = -0.7;
    }), a.addEventListener("touchend", () => {
      this.input.forward = 0;
    }), a.addEventListener("mousedown", () => {
      this.input.forward = -0.7;
    }), a.addEventListener("mouseup", () => {
      this.input.forward = 0;
    }));
    const l = document.querySelector("#btn-honk");
    l && l.addEventListener("click", () => this.playHonk());
    const m = document.querySelector("#btn-boost");
    m && (m.addEventListener("touchstart", (r) => {
      r.preventDefault(), this.input.boost = true;
    }), m.addEventListener("touchend", () => {
      this.input.boost = false;
    }), m.addEventListener("mousedown", () => {
      this.input.boost = true;
    }), m.addEventListener("mouseup", () => {
      this.input.boost = false;
    }));
  }
  initKeyboardControls() {
    window.addEventListener("keydown", (e) => {
      (e.key === "ArrowUp" || e.key === "w" || e.key === "W") && (this.input.forward = 1), (e.key === "ArrowDown" || e.key === "s" || e.key === "S") && (this.input.forward = -0.7), (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && (this.input.turn = 1), (e.key === "ArrowRight" || e.key === "d" || e.key === "D") && (this.input.turn = -1), e.key === "Shift" && (this.input.boost = true), (e.key === "h" || e.key === "H") && this.playHonk();
    }), window.addEventListener("keyup", (e) => {
      ["ArrowUp", "w", "W", "ArrowDown", "s", "S"].includes(e.key) && (this.input.forward = 0), ["ArrowLeft", "a", "A", "ArrowRight", "d", "D"].includes(e.key) && (this.input.turn = 0), e.key === "Shift" && (this.input.boost = false);
    });
  }
  initTouchControls() {
    let e = [], t = 0, i = 0, s = 1, n = 0, o = false, c = 0, a = 0;
    const l = new dt(), m = new ut();
    this.canvas.addEventListener("touchstart", (u) => {
      if (e = u.touches, e.length === 1) {
        o = true, c = e[0].clientX, a = e[0].clientY, m.x = e[0].clientX / window.innerWidth * 2 - 1, m.y = -(e[0].clientY / window.innerHeight) * 2 + 1, l.setFromCamera(m, this.camera);
        const d = l.intersectObjects(this.billboardGroup.children, true);
        if (d.length > 0) {
          const h = d[0].object;
          if (h.userData.isPrevBtn) {
            this.prevProject(), o = false;
            return;
          }
          if (h.userData.isNextBtn) {
            this.nextProject(), o = false;
            return;
          }
          if (h.userData.isScreen) {
            this.openProjectModal(this.currentProjectIndex), o = false;
            return;
          }
        }
        const g = l.intersectObjects(this.careerGroup.children, true);
        if (g.length > 0) {
          let h = g[0].object;
          for (; h && h.parent !== this.careerGroup; ) h = h.parent;
          if (h && h.userData && h.userData.milestoneIndex !== void 0) {
            this.elevateCareerStone(h.userData.milestoneIndex), o = false;
            return;
          }
        }
        if (this.character && l.intersectObjects(this.character.children, true).length > 0) {
          const x = ["Welcome to my AR Portfolio! \u{1F697}\u{1F4A8}", "I am Aditi Sharma, Full-Stack & AI Engineer!", "Check out the 3D billboard on your floor!", "Drive the car into the bowling pins for a strike! \u{1F3B3}", "Explore my career stones from VIT Vellore to HCLTech!"], S = x[Math.floor(Math.random() * x.length)];
          this.jumpCharacter(S), o = false;
          return;
        }
      } else if (e.length === 2) {
        o = false;
        const d = e[0].clientX - e[1].clientX, g = e[0].clientY - e[1].clientY;
        t = Math.hypot(d, g), i = Math.atan2(g, d), s = this.anchor.scale.x, n = this.anchor.rotation.y;
      }
    }, { passive: true }), this.canvas.addEventListener("touchmove", (u) => {
      if (e = u.touches, e.length === 1 && o) {
        const d = e[0].clientX - c, g = e[0].clientY - a;
        c = e[0].clientX, a = e[0].clientY, this.anchor.position.x += d * 35e-4, this.anchor.position.z += g * 35e-4;
      } else if (e.length === 2) {
        const d = e[0].clientX - e[1].clientX, g = e[0].clientY - e[1].clientY, h = Math.hypot(d, g), x = Math.atan2(g, d);
        if (t > 0) {
          const S = h / t, M = Math.min(Math.max(s * S, 0.25), 2.8);
          this.anchor.scale.set(M, M, M);
          const T = x - i;
          this.anchor.rotation.y = n + T;
        }
      }
    }, { passive: true }), this.canvas.addEventListener("touchend", () => {
      o = false, t = 0;
    });
    let r = false, f = 0, p = 0;
    this.canvas.addEventListener("mousedown", (u) => {
      r = true, f = u.clientX, p = u.clientY, m.x = u.clientX / window.innerWidth * 2 - 1, m.y = -(u.clientY / window.innerHeight) * 2 + 1, l.setFromCamera(m, this.camera);
      const d = l.intersectObjects(this.billboardGroup.children, true);
      if (d.length > 0) {
        const h = d[0].object;
        if (h.userData.isPrevBtn) {
          this.prevProject();
          return;
        }
        if (h.userData.isNextBtn) {
          this.nextProject();
          return;
        }
        if (h.userData.isScreen) {
          this.openProjectModal(this.currentProjectIndex);
          return;
        }
      }
      const g = l.intersectObjects(this.careerGroup.children, true);
      if (g.length > 0) {
        let h = g[0].object;
        for (; h && h.parent !== this.careerGroup; ) h = h.parent;
        if (h && h.userData && h.userData.milestoneIndex !== void 0) {
          this.elevateCareerStone(h.userData.milestoneIndex);
          return;
        }
      }
    }), window.addEventListener("mousemove", (u) => {
      if (!r) return;
      const d = u.clientX - f, g = u.clientY - p;
      f = u.clientX, p = u.clientY, this.anchor.position.x += d * 3e-3, this.anchor.position.z += g * 3e-3;
    }), window.addEventListener("mouseup", () => {
      r = false;
    });
  }
  initDeviceOrientation() {
    const e = (t) => {
      if (t.gamma === null || t.beta === null) return;
      const i = t.gamma / 90 * 0.45, s = 1.75 + (t.beta - 50) / 90 * 0.35;
      this.camera.position.x += (i - this.camera.position.x) * 0.05, this.camera.position.y += (s - this.camera.position.y) * 0.05, this.camera.lookAt(this.anchor.position.x, this.anchor.position.y + 0.6, this.anchor.position.z);
    };
    typeof DeviceOrientationEvent < "u" && typeof DeviceOrientationEvent.requestPermission == "function" ? document.body.addEventListener("click", () => {
      DeviceOrientationEvent.requestPermission().then((t) => {
        t === "granted" && window.addEventListener("deviceorientation", e);
      }).catch(() => {
      });
    }, { once: true }) : window.addEventListener("deviceorientation", e);
  }
  openProjectModal(e) {
    const t = this.projects[e];
    if (!t || !this.holoModal) return;
    document.querySelector("#modal-category").textContent = t.category || "PROJECT", document.querySelector("#modal-title").textContent = t.title, document.querySelector("#modal-tagline").textContent = t.tagline || t.attributes && t.attributes.at || "", document.querySelector("#modal-desc").textContent = t.description;
    const i = document.querySelector("#modal-problem");
    i && (i.textContent = t.problemSolved || "");
    const s = document.querySelector("#modal-features");
    s && (s.innerHTML = "", t.keyFeatures && t.keyFeatures.length > 0 && t.keyFeatures.forEach((c) => {
      const a = document.createElement("li");
      a.textContent = c, s.appendChild(a);
    }));
    const n = document.querySelector("#modal-tags");
    n && (n.innerHTML = "", (t.techStack || []).forEach((c) => {
      const a = document.createElement("span");
      a.textContent = c, n.appendChild(a);
    }));
    const o = document.querySelector("#modal-link");
    o && (o.href = t.url || "https://github.com/jiya2000"), this.holoModal.classList.add("is-open");
  }
  closeProjectModal() {
    this.holoModal && this.holoModal.classList.remove("is-open");
  }
  openCareerModal(e) {
    const t = this.careerMilestones[e];
    if (!t || !this.careerModal) return;
    document.querySelector("#career-title").textContent = t.institution, document.querySelector("#career-role").textContent = `${t.role} (${t.date})`, document.querySelector("#career-desc").textContent = t.desc;
    const i = document.querySelector("#career-tags");
    i && (i.innerHTML = "", t.skills.forEach((s) => {
      const n = document.createElement("span");
      n.textContent = s, i.appendChild(n);
    })), this.careerModal.classList.add("is-open");
  }
  closeCareerModal() {
    this.careerModal && this.careerModal.classList.remove("is-open");
  }
  openAboutModal() {
    this.aboutModal && this.aboutModal.classList.add("is-open");
  }
  closeAboutModal() {
    this.aboutModal && this.aboutModal.classList.remove("is-open");
  }
  openContactModal() {
    this.contactModal && this.contactModal.classList.add("is-open");
  }
  closeContactModal() {
    this.contactModal && this.contactModal.classList.remove("is-open");
  }
  onResize() {
    const e = window.innerWidth, t = window.innerHeight;
    this.camera.aspect = e / t, this.camera.updateProjectionMatrix(), this.renderer.setSize(e, t);
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    const e = Math.min(this.clock.getDelta(), 0.1), t = this.clock.getElapsedTime();
    this.updateVehiclePhysics(e), this.checkCarBowlingCollisions(), this.updatePinPhysics(e), this.outerRing && (this.outerRing.rotation.z = t * 0.35), this.innerRing && (this.innerRing.rotation.z = -t * 0.55), this.character && this.character.position.y === 0 && (this.character.position.y = Math.sin(t * 2.5) * 0.012), this.updateSpeechPosition(), this.renderer.render(this.scene, this.camera);
  }
  updateVehiclePhysics(e) {
    if (!this.carGroup) return;
    const t = this.vehicleState, i = this.input, s = i.forward * t.maxSpeed * (i.boost ? 1.6 : 1);
    if (Math.abs(s) > 0.01 ? t.speed = k.lerp(t.speed, s, e * t.acceleration) : t.speed = k.lerp(t.speed, 0, e * t.deceleration), Math.abs(t.speed) > 0.08) {
      const o = t.speed < 0 ? -1 : 1;
      t.heading += i.turn * t.turnSpeed * e * o;
    }
    t.steerAngle = k.lerp(t.steerAngle, i.turn * 0.45, e * 12), this.wheels.forEach((o) => {
      o.isFront && (o.holder.rotation.y = t.steerAngle), o.tire.rotation.x += t.speed * e * 12;
    });
    const n = new y(-Math.sin(t.heading), 0, -Math.cos(t.heading));
    t.pos.addScaledVector(n, t.speed * e), t.pos.x = k.clamp(t.pos.x, -2.2, 2.2), t.pos.z = k.clamp(t.pos.z, -2.2, 2.2), this.carGroup.position.copy(t.pos), this.carGroup.rotation.y = t.heading, this.playEngineRumble(Math.abs(t.speed)), this.exhaustParticles && (this.exhaustParticles.visible = Math.abs(t.speed) > 0.2, this.exhaustParticles.rotation.y += e * 6);
  }
  updatePinPhysics(e) {
    this.pins && this.pins.forEach((t) => {
      t.userData.isKnocked && (t.position.x += t.userData.vx, t.position.z += t.userData.vz, t.userData.vx *= 0.94, t.userData.vz *= 0.94, t.rotation.x += t.userData.vRotX, t.rotation.z += t.userData.vRotZ, t.userData.vRotX *= 0.92, t.userData.vRotZ *= 0.92, t.position.y > 0.04 && (t.position.y -= e * 0.5));
    });
  }
}
window.addEventListener("DOMContentLoaded", () => {
  new mt();
});
