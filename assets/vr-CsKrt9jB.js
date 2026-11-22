import { fu as k, a4 as z, f$ as T, j as q, C as V, e5 as F, G as w, al as B, g0 as O, bb as W, ax as _, b5 as Y, b3 as P, bf as G, dv as L, bt as R, $ as l, i as o, fd as H, Q as E, aK as U, bm as f, aj as N, aD as $, as as X, eW as Z, B as g, q as K, aV as J, bp as A, fb as Q, v as tt, a1 as j } from "./projects-DEZFQUrs.js";
class et {
  constructor(t) {
    const i = new k();
    i.aspect = 0.5;
    const e = new z();
    this.setEyeSeparation = function(a) {
      i.eyeSep = a;
    }, this.setSize = function(a, s) {
      t.setSize(a, s);
    }, this.render = function(a, s) {
      a.matrixWorldAutoUpdate === true && a.updateMatrixWorld(), s.parent === null && s.matrixWorldAutoUpdate === true && s.updateMatrixWorld(), i.update(s);
      const n = t.autoClear;
      t.getSize(e), t.autoClear = false, t.clear(), t.setScissorTest(true), t.setScissor(0, 0, e.width / 2, e.height), t.setViewport(0, 0, e.width / 2, e.height), t.render(a, i.cameraL), t.setScissor(e.width / 2, 0, e.width / 2, e.height), t.setViewport(e.width / 2, 0, e.width / 2, e.height), t.render(a, i.cameraR), t.setScissorTest(false), t.autoClear = n;
    };
  }
}
class st {
  constructor() {
    this.canvas = document.querySelector(".js-vr-canvas"), this.canvas && (this.vrMode = "stereo", this.currentViewpoint = "car", this.soundEnabled = true, this.audioCtx = null, this.isGazing = false, this.gazeTimer = 0, this.gazeTarget = null, this.gazeDuration = 1200, this.yaw = 0, this.pitch = 0, this.roll = 0, this.isPointerDown = false, this.pointerStart = { x: 0, y: 0 }, this.hasGyro = false, this.gyroCalibration = { alpha: null, beta: null, gamma: null }, this.projects = T && T.length > 0 ? T : [{ title: "Autonomous Clinical Trial Analyst", category: "AI / AGENTIC", tagline: "Multi-Agent Regulatory & Medical Literature Synthesis", description: "Autonomous multi-agent intelligence platform streamlining trial analysis and documentation.", problemSolved: "Reduced clinical document synthesis time by 85%.", keyFeatures: ["Multi-agent orchestration", "RAG over FDA databases", "Automated protocol parsing"], attributes: { at: "Enterprise Healthcare", stack: "FastAPI, Gemini, Docker" } }], this.currentProjectIndex = 0, this.initDOMElements(), this.initThree(), this.initAudio(), this.buildCyberEnvironment(), this.buildCyberCar(), this.buildProjectsBillboard(), this.buildCareerMonoliths(), this.buildBowlingLane(), this.buildAvatarAditi(), this.initRaycaster(), this.initEventListeners(), this.initMotionTracking(), this.animate = this.animate.bind(this), requestAnimationFrame(this.animate));
  }
  initDOMElements() {
    this.hud = document.querySelector(".js-vr-hud"), this.statusText = document.querySelector(".js-vr-status"), this.divider = document.querySelector(".js-stereo-divider"), this.reticleMono = document.querySelector(".js-gaze-reticle"), this.reticleLeft = document.querySelector(".js-gaze-reticle-left"), this.reticleRight = document.querySelector(".js-gaze-reticle-right"), this.gazeProgress = document.querySelector(".js-gaze-progress"), this.progressBar = document.querySelector(".js-progress-bar"), this.startModal = document.querySelector(".js-vr-start-modal"), this.detailsCard = document.querySelector(".js-vr-details-card"), this.detailCategory = document.querySelector(".js-detail-category"), this.detailTitle = document.querySelector(".js-detail-title"), this.detailDesc = document.querySelector(".js-detail-desc"), this.detailTags = document.querySelector(".js-detail-tags");
  }
  initThree() {
    const t = window.innerWidth, i = window.innerHeight;
    this.scene = new q(), this.scene.background = new V(656909), this.scene.fog = new F(656909, 0.035), this.cameraRig = new w(), this.camera = new B(70, t / i, 0.1, 100), this.camera.position.set(0, 1.4, 0), this.cameraRig.add(this.camera), this.scene.add(this.cameraRig), this.renderer = new O({ canvas: this.canvas, antialias: true, alpha: false, powerPreference: "high-performance" }), this.renderer.setSize(t, i), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this.renderer.toneMapping = W, this.renderer.toneMappingExposure = 1.15, this.renderer.shadowMap.enabled = true, this.renderer.shadowMap.type = _, this.stereoEffect = new et(this.renderer), this.stereoEffect.setSize(t, i), this.stereoEffect.eyeSeparation = 0.064;
    const e = new Y(14202110, 0.9);
    this.scene.add(e);
    const a = new P(16777215, 2.2);
    a.position.set(5, 12, 6), a.castShadow = true, a.shadow.mapSize.width = 1024, a.shadow.mapSize.height = 1024, this.scene.add(a);
    const s = new P(14753096, 1.8);
    s.position.set(-6, 8, -6), this.scene.add(s), this.setVRMode("stereo"), this.setViewpoint("car", true);
  }
  initAudio() {
    try {
      const t = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new t();
    } catch (t) {
      console.warn("AudioContext not supported", t);
    }
  }
  resumeAudio() {
    this.audioCtx && this.audioCtx.state === "suspended" && this.audioCtx.resume();
  }
  playTone(t, i = 0.15, e = "sine") {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();
    const a = this.audioCtx.currentTime, s = this.audioCtx.createOscillator(), n = this.audioCtx.createGain();
    s.type = e, s.frequency.setValueAtTime(t, a), n.gain.setValueAtTime(0.18, a), n.gain.exponentialRampToValueAtTime(1e-3, a + i), s.connect(n), n.connect(this.audioCtx.destination), s.start(a), s.stop(a + i);
  }
  playSuccessChime() {
    !this.soundEnabled || !this.audioCtx || (this.resumeAudio(), [523.25, 659.25, 783.99, 1046.5].forEach((t, i) => {
      setTimeout(() => this.playTone(t, 0.25, "sine"), i * 70);
    }));
  }
  buildCyberEnvironment() {
    const t = new G(80, 80), i = document.createElement("canvas");
    i.width = 256, i.height = 256;
    const e = i.getContext("2d");
    e.fillStyle = "#0f0814", e.fillRect(0, 0, 256, 256), e.strokeStyle = "rgba(168, 85, 247, 0.45)", e.lineWidth = 3, e.strokeRect(0, 0, 256, 256), e.strokeStyle = "rgba(236, 72, 153, 0.25)", e.lineWidth = 1, e.beginPath(), e.moveTo(128, 0), e.lineTo(128, 256), e.moveTo(0, 128), e.lineTo(256, 128), e.stroke();
    const a = new L(i);
    a.wrapS = R, a.wrapT = R, a.repeat.set(40, 40);
    const s = new l({ map: a, roughness: 0.65, metalness: 0.2 }), n = new o(t, s);
    n.rotation.x = -Math.PI / 2, n.receiveShadow = true, this.scene.add(n);
    const r = new H(18, 19, 64), c = new E({ color: 11032055, side: U, transparent: true, opacity: 0.4 }), h = new o(r, c);
    h.rotation.x = -Math.PI / 2, h.position.y = 0.02, this.scene.add(h);
    const u = new f(0.08, 0.08, 4, 12), d = new l({ color: 3718648, emissive: 165063, emissiveIntensity: 1.5, roughness: 0.2 });
    [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4].forEach((p) => {
      const x = Math.cos(p) * 9, v = Math.sin(p) * 9, M = new o(u, d);
      M.position.set(x, 2, v), this.scene.add(M);
    });
    const y = 300, S = new N(), b = new Float32Array(y * 3);
    for (let p = 0; p < y; p++) b[p * 3] = (Math.random() - 0.5) * 60, b[p * 3 + 1] = 4 + Math.random() * 25, b[p * 3 + 2] = (Math.random() - 0.5) * 60;
    S.setAttribute("position", new $(b, 3));
    const C = new X({ color: 15984895, size: 0.15, transparent: true, opacity: 0.75 });
    this.stars = new Z(S, C), this.scene.add(this.stars);
  }
  buildCyberCar() {
    this.carGroup = new w(), this.carGroup.position.set(0, 0, 0);
    const t = new l({ color: 10424889, metalness: 0.85, roughness: 0.2, clearcoat: 1 }), i = new l({ color: 1579035, metalness: 0.5, roughness: 0.4 }), e = new l({ color: 1120295, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.75 }), a = new l({ color: 10875900, emissive: 3718648, emissiveIntensity: 2 }), s = new o(new g(0.68, 0.08, 1.2), i);
    s.position.y = 0.08, s.castShadow = true, this.carGroup.add(s);
    const n = new o(new g(0.62, 0.14, 1.12), t);
    n.position.y = 0.16, n.castShadow = true, this.carGroup.add(n);
    const r = new o(new g(0.48, 0.14, 0.52), e);
    r.position.set(0, 0.27, -0.05), r.castShadow = true, this.carGroup.add(r);
    const c = new o(new g(0.55, 0.03, 0.16), t);
    c.position.set(0, 0.28, 0.45), this.carGroup.add(c);
    const h = new o(new g(0.12, 0.04, 0.04), a);
    h.position.set(-0.22, 0.15, -0.56);
    const u = new o(new g(0.12, 0.04, 0.04), a);
    u.position.set(0.22, 0.15, -0.56), this.carGroup.add(h, u);
    const d = new K(10875900, 2.5, 6, Math.PI / 4, 0.4);
    d.position.set(0, 0.2, -0.56);
    const m = new J();
    m.position.set(0, 0, -4), this.carGroup.add(d, m), d.target = m;
    const y = new f(0.1, 0.1, 0.08, 18);
    y.rotateZ(Math.PI / 2);
    const S = new l({ color: 2042167, roughness: 0.8 }), b = new l({ color: 14753096, emissive: 10424889, metalness: 0.9, roughness: 0.2 }), C = [[-0.34, 0.1, -0.34], [0.34, 0.1, -0.34], [-0.34, 0.1, 0.34], [0.34, 0.1, 0.34]];
    this.carWheels = [], C.forEach((x) => {
      const v = new w();
      v.position.set(x[0], x[1], x[2]);
      const M = new o(y, S);
      M.castShadow = true, v.add(M);
      const I = new o(new f(0.06, 0.06, 0.085, 12).rotateZ(Math.PI / 2), b);
      v.add(I), this.carGroup.add(v), this.carWheels.push(M);
    });
    const p = new o(new g(1.2, 0.7, 1.6), new E({ transparent: true, opacity: 0 }));
    p.position.y = 0.25, p.userData = { type: "car_cockpit", title: "Cyber Sports Car", category: "VEHICLE", desc: "Gaze here to enter the driver cockpit seat and look out the windshield." }, this.carGroup.add(p), this.interactiveMeshes = this.interactiveMeshes || [], this.interactiveMeshes.push(p), this.scene.add(this.carGroup);
  }
  buildProjectsBillboard() {
    this.billboardGroup = new w(), this.billboardGroup.position.set(-3.2, 0, -1.8), this.billboardGroup.rotation.y = Math.PI / 4;
    const t = new l({ color: 1576986, metalness: 0.7, roughness: 0.3 }), i = new o(new f(0.06, 0.06, 2.4, 12), t);
    i.position.set(-1.15, 1.2, 0);
    const e = new o(new f(0.06, 0.06, 2.4, 12), t);
    e.position.set(1.15, 1.2, 0), this.billboardGroup.add(i, e), this.projCanvas = document.createElement("canvas"), this.projCanvas.width = 1024, this.projCanvas.height = 640, this.projTex = new L(this.projCanvas), this.updateProjectCanvas(this.currentProjectIndex);
    const a = new E({ map: this.projTex }), s = new G(2.2, 1.35);
    this.screenMesh = new o(s, a), this.screenMesh.position.set(0, 1.65, 0.02), this.billboardGroup.add(this.screenMesh);
    const n = new g(2.3, 1.45, 0.08), r = new o(n, t);
    r.position.set(0, 1.65, -0.02), this.billboardGroup.add(r);
    const c = new g(0.24, 0.24, 0.06), h = new l({ color: 11032055, emissive: 8266446, emissiveIntensity: 1.2, roughness: 0.3 }), u = new o(c, h);
    u.position.set(-1.35, 1.65, 0.05), u.userData = { type: "project_prev" };
    const d = new o(c, h);
    d.position.set(1.35, 1.65, 0.05), d.userData = { type: "project_next" }, this.billboardGroup.add(u, d), this.interactiveMeshes.push(u, d), this.screenMesh.userData = { type: "project_detail" }, this.interactiveMeshes.push(this.screenMesh), this.scene.add(this.billboardGroup);
  }
  updateProjectCanvas(t) {
    const i = this.projects[t];
    if (!i || !this.projCanvas) return;
    const e = this.projCanvas.getContext("2d"), a = this.projCanvas.width, s = this.projCanvas.height;
    e.fillStyle = "#170c18", e.fillRect(0, 0, a, s);
    const n = e.createLinearGradient(0, 0, a, s);
    n.addColorStop(0, "rgba(168, 85, 247, 0.25)"), n.addColorStop(1, "rgba(236, 72, 153, 0.15)"), e.fillStyle = n, e.fillRect(0, 0, a, s), e.strokeStyle = "#a855f7", e.lineWidth = 8, e.strokeRect(10, 10, a - 20, s - 20), e.fillStyle = "#ec4899", e.font = "bold 26px sans-serif", e.fillText(`PROJECT ${t + 1} / ${this.projects.length} \u2022 ${i.category || "FEATURED"}`, 48, 65), e.fillStyle = "#ffffff", e.font = "bold 50px sans-serif";
    const r = i.title.length > 32 ? i.title.slice(0, 30) + "..." : i.title;
    e.fillText(r, 48, 140), e.fillStyle = "#d8b4fe", e.font = "600 28px sans-serif";
    const c = i.tagline || i.attributes && i.attributes.at || "Engineering & Software Architecture";
    e.fillText(c, 48, 195), e.fillStyle = "#e2e8f0", e.font = "26px sans-serif", this.wrapText(e, i.description, 48, 260, a - 96, 38, 4);
    const h = i.attributes && i.attributes.stack || (i.keyFeatures ? i.keyFeatures.slice(0, 3).join(" \u2022 ") : "Full-Stack");
    e.fillStyle = "#38bdf8", e.font = "bold 24px sans-serif", e.fillText(`STACK: ${h}`, 48, 480), e.fillStyle = "#a855f7", e.font = "bold 24px sans-serif", e.fillText("\u{1F441}\uFE0F Gaze at billboard to view complete project specification", 48, 560), this.projTex && (this.projTex.needsUpdate = true);
  }
  wrapText(t, i, e, a, s, n, r = 4) {
    if (!i) return;
    const c = i.split(" ");
    let h = "", u = 0;
    for (let d = 0; d < c.length; d++) {
      const m = h + c[d] + " ";
      if (t.measureText(m).width > s && d > 0) {
        if (t.fillText(h, e, a), h = c[d] + " ", a += n, u++, u >= r - 1) {
          h += "...";
          break;
        }
      } else h = m;
    }
    t.fillText(h, e, a);
  }
  buildCareerMonoliths() {
    this.careerGroup = new w(), this.careerGroup.position.set(3.2, 0, -1.2), this.careerGroup.rotation.y = -Math.PI / 4, this.careerMilestones = [{ title: "VIT Vellore M.Tech CSE", sub: "9.65 CGPA \u2022 Rank 3", desc: "Integrated M.Tech in Computer Science & Engineering. Top academic honours." }, { title: "HCLTech Software Intern", sub: "AI & Multi-Agent Systems", desc: "Engineered automated multi-agent operational frameworks & cloud intelligence." }, { title: "Team Sammard Rocketry", sub: "CS Division Lead", desc: "Led telemetry systems, ground control visualization, and trajectory physics." }, { title: "NDA 149 Merit AIR 417", sub: "National Defence Academy", desc: "All India Merit List Rank 417 out of hundreds of thousands of applicants." }, { title: "VIT Student Council", sub: "Member Secretary", desc: "Executive leadership representing 35,000+ university students." }], this.careerStones = [];
    const t = new l({ color: 2562347, roughness: 0.7, metalness: 0.3 }), i = new l({ color: 3718648, emissive: 165063, emissiveIntensity: 1.6 });
    this.careerMilestones.forEach((e, a) => {
      const s = new w(), n = a / (this.careerMilestones.length - 1) * 1.2 - 0.6, r = 1.4 + a * 0.7;
      s.position.set(Math.sin(n) * r, 0, -Math.cos(n) * r);
      const c = 1.2 + a * 0.15, h = new o(new g(0.42, c, 0.28), t);
      h.position.y = c / 2, h.castShadow = true, s.add(h);
      const u = new o(new g(0.46, 0.08, 0.32), i);
      u.position.y = c + 0.04, s.add(u), s.userData = { type: "career_stone", index: a, data: e }, this.careerGroup.add(s), this.interactiveMeshes.push(h), h.userData = s.userData, this.careerStones.push({ group: s, baseY: 0, targetY: 0 });
    }), this.scene.add(this.careerGroup);
  }
  buildBowlingLane() {
    this.bowlingGroup = new w(), this.bowlingGroup.position.set(0, 0, 3.8);
    const t = new l({ color: 2036772, roughness: 0.3, metalness: 0.4 }), i = new o(new g(1.6, 0.04, 3.2), t);
    i.position.set(0, 0.02, 0), this.bowlingGroup.add(i);
    const e = new f(0.04, 0.07, 0.35, 12), a = new l({ color: 16317180, roughness: 0.3 }), s = [[0, 0.8], [-0.14, 1.1], [0.14, 1.1], [-0.28, 1.4], [0, 1.4], [0.28, 1.4]];
    this.pins = [], s.forEach((r) => {
      const c = new o(e, a);
      c.position.set(r[0], 0.2, r[1]), c.castShadow = true, this.bowlingGroup.add(c), this.pins.push(c);
    });
    const n = new o(new f(0.18, 0.18, 0.06, 16), new l({ color: 15680580, emissive: 10033947, emissiveIntensity: 1.2 }));
    n.position.set(0, 0.1, -1.4), n.userData = { type: "bowling_reset" }, this.bowlingGroup.add(n), this.interactiveMeshes.push(n), this.scene.add(this.bowlingGroup);
  }
  buildAvatarAditi() {
    const t = new w();
    t.position.set(-1.4, 0, 0.8);
    const i = new l({ color: 12458077, roughness: 0.4 }), e = new l({ color: 16502760, roughness: 0.6 }), a = new l({ color: 2562347, roughness: 0.8 }), s = new o(new f(0.12, 0.16, 0.55, 12), i);
    s.position.y = 0.8, s.castShadow = true, t.add(s);
    const n = new o(new A(0.12, 16, 16), e);
    n.position.y = 1.2, n.castShadow = true, t.add(n);
    const r = new o(new A(0.13, 16, 16), a);
    r.position.set(0, 1.24, -0.02), t.add(r), this.scene.add(t);
  }
  initRaycaster() {
    this.raycaster = new Q(), this.centerPoint = new z(0, 0);
  }
  updateGaze(t) {
    var _a, _b;
    if (!this.interactiveMeshes || this.interactiveMeshes.length === 0) return;
    this.raycaster.setFromCamera(this.centerPoint, this.camera);
    const i = this.raycaster.intersectObjects(this.interactiveMeshes, true);
    if (i.length > 0) {
      let e = i[0].object;
      for (; e && !((_a = e.userData) == null ? void 0 : _a.type) && e.parent; ) e = e.parent;
      if (e && ((_b = e.userData) == null ? void 0 : _b.type)) {
        this.gazeTarget !== e && (this.gazeTarget = e, this.gazeTimer = 0, this.setReticleGazeState(true)), this.gazeTimer += t;
        const a = Math.min(this.gazeTimer / this.gazeDuration, 1);
        this.updateProgressBar(a), this.gazeTimer >= this.gazeDuration && (this.triggerGazeAction(e.userData), this.gazeTimer = 0, this.updateProgressBar(0));
        return;
      }
    }
    this.gazeTarget && (this.gazeTarget = null, this.gazeTimer = 0, this.setReticleGazeState(false), this.updateProgressBar(0));
  }
  setReticleGazeState(t) {
    this.reticleMono && (t ? this.reticleMono.classList.add("is-gazing") : this.reticleMono.classList.remove("is-gazing")), this.reticleLeft && (t ? this.reticleLeft.classList.add("is-gazing") : this.reticleLeft.classList.remove("is-gazing")), this.reticleRight && (t ? this.reticleRight.classList.add("is-gazing") : this.reticleRight.classList.remove("is-gazing")), this.gazeProgress && (t ? this.gazeProgress.classList.add("is-active") : this.gazeProgress.classList.remove("is-active"));
  }
  updateProgressBar(t) {
    if (!this.progressBar) return;
    const i = 126, e = i - i * t;
    this.progressBar.style.strokeDashoffset = e;
  }
  triggerGazeAction(t) {
    this.playTone(880, 0.12), t.type === "project_prev" ? (this.currentProjectIndex = (this.currentProjectIndex - 1 + this.projects.length) % this.projects.length, this.updateProjectCanvas(this.currentProjectIndex)) : t.type === "project_next" ? (this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length, this.updateProjectCanvas(this.currentProjectIndex)) : t.type === "project_detail" ? this.showDetailCard(this.projects[this.currentProjectIndex]) : t.type === "career_stone" ? (this.careerStones[t.index] && (this.careerStones[t.index].targetY = 0.45, setTimeout(() => {
      this.careerStones[t.index] && (this.careerStones[t.index].targetY = 0);
    }, 4e3)), this.showDetailCard({ category: "CAREER MILESTONE", title: t.data.title, tagline: t.data.sub, description: t.data.desc, attributes: { stack: "Leadership \u2022 Engineering" } }), this.playSuccessChime()) : t.type === "car_cockpit" ? this.setViewpoint("cockpit") : t.type === "bowling_reset" && (this.pins.forEach((i) => {
      i.rotation.set(0, 0, 0), i.position.y = 0.2;
    }), this.playSuccessChime());
  }
  showDetailCard(t) {
    this.detailsCard && (this.detailCategory && (this.detailCategory.textContent = t.category || "FEATURED"), this.detailTitle && (this.detailTitle.textContent = t.title), this.detailDesc && (this.detailDesc.textContent = t.description || t.tagline || ""), this.detailTags && (this.detailTags.innerHTML = "", (t.attributes && t.attributes.stack ? t.attributes.stack.split(",") : t.keyFeatures || ["Virtual Reality", "Three.js"]).forEach((e) => {
      const a = document.createElement("span");
      a.textContent = e.trim(), this.detailTags.appendChild(a);
    })), this.detailsCard.classList.add("is-visible"));
  }
  initMotionTracking() {
    new URLSearchParams(window.location.search).get("skipmodal") === "1" && this.startModal && this.startModal.classList.add("is-hidden");
    const i = (s) => {
      if (s.alpha === null || s.beta === null || s.gamma === null) return;
      this.hasGyro = true, this.gyroCalibration.alpha === null && (this.gyroCalibration.alpha = s.alpha, this.gyroCalibration.beta = s.beta, this.gyroCalibration.gamma = s.gamma);
      const n = j.degToRad(s.alpha - this.gyroCalibration.alpha), r = j.degToRad(s.beta - 50), c = j.degToRad(s.gamma);
      this.camera.rotation.set(r, -n, -c, "YXZ");
    }, e = document.querySelector(".js-btn-enter-vr");
    e && e.addEventListener("click", async () => {
      if (this.resumeAudio(), typeof DeviceOrientationEvent < "u" && typeof DeviceOrientationEvent.requestPermission == "function") try {
        await DeviceOrientationEvent.requestPermission() === "granted" && window.addEventListener("deviceorientation", i);
      } catch (s) {
        console.warn("DeviceOrientation permission error", s);
      }
      else window.addEventListener("deviceorientation", i);
      this.startModal && this.startModal.classList.add("is-hidden"), this.enterFullscreen();
    });
    const a = document.querySelector(".js-btn-dismiss-modal");
    a && a.addEventListener("click", () => {
      this.startModal && this.startModal.classList.add("is-hidden");
    }), window.addEventListener("pointerdown", (s) => {
      this.isPointerDown = true, this.pointerStart = { x: s.clientX, y: s.clientY };
    }), window.addEventListener("pointermove", (s) => {
      if (!this.isPointerDown || this.hasGyro) return;
      const n = (s.clientX - this.pointerStart.x) * 35e-4, r = (s.clientY - this.pointerStart.y) * 35e-4;
      this.yaw -= n, this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch - r)), this.pointerStart = { x: s.clientX, y: s.clientY }, this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
    }), window.addEventListener("pointerup", () => {
      this.isPointerDown = false;
    });
  }
  recenter() {
    this.yaw = 0, this.pitch = 0, this.camera.rotation.set(0, 0, 0), this.gyroCalibration = { alpha: null, beta: null, gamma: null }, this.playTone(660, 0.1);
  }
  setViewpoint(t, i = false) {
    this.currentViewpoint = t, document.querySelectorAll(".viewpoint-btn").forEach((a) => {
      a.dataset.viewpoint === t ? a.classList.add("is-active") : a.classList.remove("is-active");
    });
    let e = new tt(0, 1.4, 2.2);
    t === "car" ? (e.set(0, 1.35, 2.2), this.yaw = 0) : t === "cockpit" ? (e.set(0, 0.32, 0.05), this.yaw = 0, this.playTone(330, 0.2)) : t === "projects" ? (e.set(-2, 1.5, -0.6), this.yaw = Math.PI / 4) : t === "career" ? (e.set(2, 1.4, 0.2), this.yaw = -Math.PI / 4) : t === "bowling" && (e.set(0, 1.2, 1.8), this.yaw = 0), i ? (this.cameraRig.position.copy(e), this.camera.rotation.set(0, this.yaw, 0)) : this.targetRigPos = e;
  }
  setVRMode(t) {
    this.vrMode = t, document.querySelectorAll(".mode-tab").forEach((i) => {
      i.dataset.vrmode === t ? i.classList.add("is-active") : i.classList.remove("is-active");
    }), t === "stereo" ? (this.divider && this.divider.classList.add("is-active"), document.body.classList.add("stereo-reticles-active"), this.statusText && (this.statusText.textContent = "STEREOSCOPIC 3D \u2022 CARDBOARD MODE")) : (this.divider && this.divider.classList.remove("is-active"), document.body.classList.remove("stereo-reticles-active"), this.statusText && (this.statusText.textContent = "MONO 360\xB0 \u2022 GYRO HEAD TRACKING"));
  }
  enterFullscreen() {
    document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {
    });
  }
  initEventListeners() {
    window.addEventListener("resize", () => {
      const s = window.innerWidth, n = window.innerHeight;
      this.camera.aspect = s / n, this.camera.updateProjectionMatrix(), this.renderer.setSize(s, n), this.stereoEffect.setSize(s, n);
    });
    const t = document.querySelector(".js-btn-recenter");
    t && t.addEventListener("click", () => this.recenter());
    const i = document.querySelector(".js-btn-fullscreen");
    i && i.addEventListener("click", () => this.enterFullscreen());
    const e = document.querySelector(".js-btn-sound");
    e && e.addEventListener("click", () => {
      this.soundEnabled = !this.soundEnabled, e.querySelector(".sound-icon").textContent = this.soundEnabled ? "\u{1F50A}" : "\u{1F507}";
    }), document.querySelectorAll(".mode-tab").forEach((s) => {
      s.addEventListener("click", () => {
        s.dataset.vrmode && this.setVRMode(s.dataset.vrmode);
      });
    }), document.querySelectorAll(".viewpoint-btn").forEach((s) => {
      s.addEventListener("click", () => {
        s.dataset.viewpoint && this.setViewpoint(s.dataset.viewpoint);
      });
    });
    const a = document.querySelector(".js-detail-close");
    a && a.addEventListener("click", () => {
      this.detailsCard && this.detailsCard.classList.remove("is-visible");
    });
  }
  animate() {
    requestAnimationFrame(this.animate);
    const t = 16.6;
    this.targetRigPos && (this.cameraRig.position.lerp(this.targetRigPos, 0.08), this.cameraRig.position.distanceTo(this.targetRigPos) < 0.05 && (this.cameraRig.position.copy(this.targetRigPos), this.targetRigPos = null)), this.careerStones && this.careerStones.forEach((i) => {
      i.group.position.y += (i.targetY - i.group.position.y) * 0.1;
    }), this.updateGaze(t), this.carWheels && this.carWheels.forEach((i) => {
      i.rotation.x += 0.01;
    }), this.vrMode === "stereo" ? this.stereoEffect.render(this.scene, this.camera) : this.renderer.render(this.scene, this.camera);
  }
}
window.addEventListener("DOMContentLoaded", () => {
  new st();
});
