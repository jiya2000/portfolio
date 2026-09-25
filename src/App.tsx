import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { LoadingScreen } from './components/LoadingScreen';
import { InfoOverlay } from './components/InfoOverlay';

// ─── Camera keyframes ──────────────────────────────────────
const KEYFRAMES = {
  loading: { pos: [-350, 350, 350], foc: [0, -50, 0] },
  idle:    { pos: [-180, 100, 180], foc: [0, 5, 0] },
  desk:    { pos: [0, 18, 55],      foc: [0, 7, 0] },
  monitor: { pos: [0, 9.5, 22],     foc: [0, 9.5, 0] },
};

// ─── Terminal log lines ─────────────────────────────────────
const LOGS: { text: string; color?: string; bold?: boolean; bg?: string }[] = [
  { text: "Initializing Sharma Operating System (SOS)...", color: '#33ff33' },
  { text: "Booting HCLTech Enterprise Multi-Agent Cloud Platform...", color: '#33ff33' },
  { text: "--> Connecting to Azure Kubernetes Service...", color: '#ffcc44' },
  { text: "SUCCESS: Authenticated as aditi.sharma@hcltech.com", color: '#44aaff', bold: true },
  { text: "" },
  { text: "Agent [FinOps]    online. Optimizing resource allocation...", color: '#33ff33' },
  { text: "Agent [Security]  online. Running compliance checks... PASS", color: '#44aaff' },
  { text: "Agent [Ops]       online. Monitoring telemetry endpoints...", color: '#33ff33' },
  { text: "" },
  { text: "═══════════════════════════════════════════", color: '#1a6633' },
  { text: " CANDIDATE PROFILE: Aditi Sharma", color: '#ffffff', bold: true, bg: '#0a3a0a' },
  { text: "═══════════════════════════════════════════", color: '#1a6633' },
  { text: "" },
  { text: " > Education:  M.Tech CSE (Data Science) — VIT", color: '#ffcc44' },
  { text: " > CGPA:       9.65 / 10.0", color: '#ffcc44' },
  { text: " > NDA:        AIR 417", color: '#ffcc44' },
  { text: " > Arts:       Classical Kathak Dancer", color: '#ffcc44' },
  { text: "" },
  { text: "───────────────────────────────────────────", color: '#1a6633' },
  { text: " EXPERIENCE", color: '#ffffff', bold: true },
  { text: "───────────────────────────────────────────", color: '#1a6633' },
  { text: "" },
  { text: " > HCLTech | SDE — Multi-Agent Cloud Platform", color: '#ffcc44' },
  { text: "   Designed autonomous K8s agents (FinOps,", color: '#aaaaaa' },
  { text: "   Security, Ops) on Azure AKS. Built CI/CD", color: '#aaaaaa' },
  { text: "   pipeline monitoring with real-time alerts.", color: '#aaaaaa' },
  { text: "" },
  { text: " > Samsung R&D | SDE — On-Device AI", color: '#ffcc44' },
  { text: "   Optimized ONNX model inference on Exynos NPU.", color: '#aaaaaa' },
  { text: "   Reduced latency 34% for vision pipeline.", color: '#aaaaaa' },
  { text: "" },
  { text: "───────────────────────────────────────────", color: '#1a6633' },
  { text: " PROJECTS", color: '#ffffff', bold: true },
  { text: "───────────────────────────────────────────", color: '#1a6633' },
  { text: "" },
  { text: " > ClaimGraphAI — Patent NLP Engine", color: '#ffcc44' },
  { text: "   Graph-RAG patent claim optimizer.", color: '#aaaaaa' },
  { text: "   Dependency parsing + prior art detection.", color: '#aaaaaa' },
  { text: "" },
  { text: " > Clinical Trial RAG System", color: '#ffcc44' },
  { text: "   Autonomous doc parsing with 95% retrieval", color: '#aaaaaa' },
  { text: "   accuracy. Built on LangChain + FAISS.", color: '#aaaaaa' },
  { text: "" },
  { text: " > Student Data Analytics Pipeline", color: '#ffcc44' },
  { text: "   End-to-end ETL + dashboard for 50K+ records.", color: '#aaaaaa' },
  { text: "" },
  { text: "═══════════════════════════════════════════", color: '#1a6633' },
  { text: " System Ready. All agents operational.", color: '#33ff33', bold: true },
  { text: " Awaiting input...", color: '#33ff33' },
  { text: "" },
  { text: " GitHub:   github.com/jiya2000", color: '#44aaff' },
  { text: " Email:    aditisharma20004@gmail.com", color: '#44aaff' },
];

export default function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const termLinesRef = useRef<typeof LOGS>([]);
  const lineIdxRef = useRef(0);
  const cursorBlinkRef = useRef(0);
  const scrollOffsetRef = useRef(0);

  const currentKeyRef = useRef('loading');
  const posRef = useRef(new THREE.Vector3(...KEYFRAMES.loading.pos as [number, number, number]));
  const focRef = useRef(new THREE.Vector3(...KEYFRAMES.loading.foc as [number, number, number]));
  const mouseRef = useRef({ x: 0, y: 0 });

  const [loaded, setLoaded] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [inMonitor, setInMonitor] = useState(false);

  // ─── Transition ───────────────────────────────────────────
  const transition = useCallback((key: keyof typeof KEYFRAMES, duration = 1000) => {
    if (currentKeyRef.current === key) return;
    TWEEN.removeAll();
    currentKeyRef.current = key;
    const kf = KEYFRAMES[key];
    new TWEEN.Tween(posRef.current)
      .to({ x: kf.pos[0], y: kf.pos[1], z: kf.pos[2] }, duration)
      .easing(TWEEN.Easing.Quintic.InOut).start();
    new TWEEN.Tween(focRef.current)
      .to({ x: kf.foc[0], y: kf.foc[1], z: kf.foc[2] }, duration)
      .easing(TWEEN.Easing.Quintic.InOut).start();
  }, []);

  // ─── Build the entire scene ───────────────────────────────
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a12, 0.004);

    // Camera
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 9000);
    camera.position.copy(posRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a12);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainerRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lighting ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // Main desk lamp (warm spot)
    const deskLamp = new THREE.SpotLight(0xfff0d0, 120, 150, 0.5, 0.8, 1.5);
    deskLamp.position.set(15, 35, 25);
    deskLamp.target.position.set(0, 0, 0);
    deskLamp.castShadow = true;
    deskLamp.shadow.mapSize.set(1024, 1024);
    scene.add(deskLamp);
    scene.add(deskLamp.target);

    // Monitor glow (greenish from screen)
    const monitorGlow = new THREE.PointLight(0x33ff33, 8, 30, 2);
    monitorGlow.position.set(0, 10, 6);
    scene.add(monitorGlow);

    // Subtle fill light
    const fillLight = new THREE.PointLight(0x4488cc, 5, 80);
    fillLight.position.set(-20, 20, 15);
    scene.add(fillLight);

    // ── Floor ──
    const floorGeo = new THREE.PlaneGeometry(400, 400);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x12121a, roughness: 0.95 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Wall ──
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x18182a, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), wallMat);
    backWall.position.set(0, 100, -60);
    scene.add(backWall);

    // ── Desk ──
    const deskColor = 0x3d2b1f;
    const topMat = new THREE.MeshStandardMaterial({ color: deskColor, roughness: 0.65, metalness: 0.05 });
    const tabletop = new THREE.Mesh(new THREE.BoxGeometry(50, 0.8, 25), topMat);
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;
    scene.add(tabletop);

    // Desk edge trim
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0f, roughness: 0.5 });
    const frontEdge = new THREE.Mesh(new THREE.BoxGeometry(50, 1.2, 0.3), edgeMat);
    frontEdge.position.set(0, -0.1, 12.5);
    scene.add(frontEdge);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.2 });
    const legGeo = new THREE.CylinderGeometry(0.35, 0.35, 10, 8);
    [[-23, -5, -10], [23, -5, -10], [-23, -5, 10], [23, -5, 10]].forEach(p => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(p[0], p[1], p[2]);
      leg.castShadow = true;
      scene.add(leg);
    });

    // ── CRT Monitor ──
    const monGroup = new THREE.Group();
    monGroup.position.set(0, 0.4, -2);

    // Back casing
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xd4cbb8, roughness: 0.85, metalness: 0.05 });
    const casing = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 12), casingMat);
    casing.position.set(0, 7.5, -3);
    casing.castShadow = true;
    monGroup.add(casing);

    // Front bezel
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0xc8bfa8, roughness: 0.7 });
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(17.5, 13.5, 0.6), bezelMat);
    bezel.position.set(0, 7.5, 3.1);
    monGroup.add(bezel);

    // Power LED
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x33ff33 });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), ledMat);
    led.position.set(7.5, 1.8, 3.4);
    monGroup.add(led);

    // ── Monitor Screen (CanvasTexture) ──
    const CANVAS_W = 1024;
    const CANVAS_H = 768;
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = CANVAS_W;
    screenCanvas.height = CANVAS_H;
    screenCanvasRef.current = screenCanvas;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTextureRef.current = screenTexture;

    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(15, 11), screenMat);
    screenMesh.position.set(0, 7.5, 3.42);
    monGroup.add(screenMesh);

    // Slight screen bezel inset (dark border)
    const insetMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const inset = new THREE.Mesh(new THREE.PlaneGeometry(15.4, 11.4), insetMat);
    inset.position.set(0, 7.5, 3.41);
    monGroup.add(inset);

    // Stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0xd4cbb8, roughness: 0.8 });
    const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.5, 1.5, 16), standMat);
    standNeck.position.set(0, 0.35, 0);
    monGroup.add(standNeck);
    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4, 0.4, 16), standMat);
    standBase.position.set(0, -0.4, 0);
    monGroup.add(standBase);

    scene.add(monGroup);

    // ── Keyboard ──
    const kbGroup = new THREE.Group();
    kbGroup.position.set(0, 0.45, 8);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0xd4cbb8, roughness: 0.8 });
    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 5), kbMat);
    kbGroup.add(kbBase);
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
    for (let row = 0; row < 4; row++) {
      const keysInRow = row === 3 ? 8 : 12;
      for (let col = 0; col < keysInRow; col++) {
        const w = row === 3 && col === 4 ? 4 : 0.85;
        const key = new THREE.Mesh(new THREE.BoxGeometry(w, 0.25, 0.85), keyMat);
        const xOff = row === 3 ? (col < 4 ? -5.5 + col * 1.05 : (col === 4 ? 0 : 2 + (col - 5) * 1.05)) : -5.5 + col * 1.05;
        key.position.set(xOff, 0.27, -1.5 + row * 1.15);
        kbGroup.add(key);
      }
    }
    scene.add(kbGroup);

    // ── Mouse ──
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0xd4cbb8, roughness: 0.8 });
    const mouseBody = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 3), mouseMat);
    mouseBody.position.set(12, 0.65, 8);
    mouseBody.castShadow = true;
    scene.add(mouseBody);
    // Mouse buttons
    const mbMat = new THREE.MeshStandardMaterial({ color: 0xb8a888, roughness: 0.6 });
    const mb1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 1.2), mbMat);
    mb1.position.set(11.55, 0.95, 7.4);
    scene.add(mb1);
    const mb2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 1.2), mbMat);
    mb2.position.set(12.45, 0.95, 7.4);
    scene.add(mb2);

    // ── Coffee Mug ──
    const mugGroup = new THREE.Group();
    mugGroup.position.set(-18, 0.4, 5);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 });
    const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1, 3, 16), mugMat);
    mugBody.position.y = 1.5;
    mugBody.castShadow = true;
    mugGroup.add(mugBody);
    const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x3d1c02, roughness: 0.3 });
    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.1, 16), coffeeMat);
    coffee.position.y = 2.9;
    mugGroup.add(coffee);
    const handleGeo = new THREE.TorusGeometry(0.65, 0.12, 8, 12, Math.PI);
    const handleMesh = new THREE.Mesh(handleGeo, mugMat);
    handleMesh.position.set(1.25, 1.8, 0);
    handleMesh.rotation.z = -Math.PI / 2;
    mugGroup.add(handleMesh);
    scene.add(mugGroup);

    // ── Notepad / Sticky Notes ──
    const noteMat = new THREE.MeshStandardMaterial({ color: 0xffee88, roughness: 0.9 });
    const note = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.05, 4), noteMat);
    note.position.set(-14, 0.42, 7);
    note.rotation.y = 0.15;
    scene.add(note);
    const noteMat2 = new THREE.MeshStandardMaterial({ color: 0x88ddff, roughness: 0.9 });
    const note2 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, 3), noteMat2);
    note2.position.set(-13, 0.44, 6.5);
    note2.rotation.y = -0.1;
    scene.add(note2);

    // ── Pen ──
    const penMat = new THREE.MeshStandardMaterial({ color: 0x222288, metalness: 0.6, roughness: 0.3 });
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6, 8), penMat);
    pen.position.set(-12, 0.5, 9);
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.3;
    scene.add(pen);

    // ── Book Stack ──
    const bookColors = [0x8b0000, 0x00008b, 0x006400];
    bookColors.forEach((c, i) => {
      const bookMat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 });
      const book = new THREE.Mesh(new THREE.BoxGeometry(5, 0.8, 7), bookMat);
      book.position.set(20, 0.8 + i * 0.8, -5);
      book.rotation.y = 0.05 * i;
      book.castShadow = true;
      scene.add(book);
    });

    // ── Raycaster for monitor click detection ──
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();

    // ── Mouse events ──
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseDown = (e: MouseEvent) => {
      // Raycast check for monitor
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObject(screenMesh, true);

      if (hits.length > 0) {
        if (currentKeyRef.current !== 'monitor') {
          currentKeyRef.current = '';
          transition('monitor', 2000);
          setInMonitor(true);
        }
        return;
      }

      e.preventDefault();
      if (currentKeyRef.current === 'monitor') {
        transition('desk');
        setInMonitor(false);
      } else if (currentKeyRef.current === 'idle') {
        transition('desk');
      } else if (currentKeyRef.current === 'desk') {
        transition('idle', 2000);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Terminal Typewriter ──
    let lastTypeTime = 0;
    const TYPE_INTERVAL = 120; // ms between lines

    // ── Draw Screen Function ──
    const drawScreen = (time: number) => {
      const ctx = screenCanvas.getContext('2d');
      if (!ctx) return;

      // Background
      const grad = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, 100, CANVAS_W / 2, CANVAS_H / 2, CANVAS_W);
      grad.addColorStop(0, '#0a1a1a');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Vignette
      const vignette = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.3, CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.8);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Title bar
      ctx.fillStyle = '#0a3a0a';
      ctx.fillRect(0, 0, CANVAS_W, 32);
      ctx.fillStyle = '#33ff33';
      ctx.font = 'bold 14px "Share Tech Mono", monospace';
      ctx.fillText('⬛ aditi@portfolio:~$ k8s_agent_monitor.sh', 12, 22);
      ctx.fillStyle = '#ff4444';
      ctx.fillText('✕', CANVAS_W - 24, 22);

      // Bottom taskbar
      ctx.fillStyle = '#0a1a0a';
      ctx.fillRect(0, CANVAS_H - 32, CANVAS_W, 32);
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#33ff33';
      ctx.lineWidth = 2;
      ctx.strokeRect(8, CANVAS_H - 28, 60, 24);
      ctx.fillStyle = '#33ff33';
      ctx.font = 'bold 13px "Share Tech Mono", monospace';
      ctx.fillText('START', 16, CANVAS_H - 11);
      ctx.fillStyle = '#1a6633';
      ctx.font = '12px "Share Tech Mono", monospace';
      ctx.fillText('SHARMA_OS v2.0', CANVAS_W - 160, CANVAS_H - 11);

      // Type new lines
      if (time - lastTypeTime > TYPE_INTERVAL && lineIdxRef.current < LOGS.length) {
        termLinesRef.current.push(LOGS[lineIdxRef.current]);
        lineIdxRef.current++;
        lastTypeTime = time;
        // Auto-scroll if too many lines
        const maxVisible = 32;
        if (termLinesRef.current.length > maxVisible) {
          scrollOffsetRef.current = termLinesRef.current.length - maxVisible;
        }
      }

      // Draw terminal lines
      ctx.font = '14px "Share Tech Mono", monospace';
      const lineHeight = 20;
      const startY = 52;
      const visibleLines = termLinesRef.current.slice(scrollOffsetRef.current);
      visibleLines.forEach((line, i) => {
        const y = startY + i * lineHeight;
        if (y > CANVAS_H - 40) return;

        if (line.bg) {
          ctx.fillStyle = line.bg;
          ctx.fillRect(12, y - 14, CANVAS_W - 24, lineHeight);
        }
        ctx.fillStyle = line.color || '#33ff33';
        ctx.font = (line.bold ? 'bold ' : '') + '14px "Share Tech Mono", monospace';
        ctx.fillText(line.text, 20, y);
      });

      // Blinking cursor
      cursorBlinkRef.current += 1;
      if (cursorBlinkRef.current % 40 < 20) {
        const cursorY = startY + visibleLines.length * lineHeight;
        if (cursorY < CANVAS_H - 40) {
          ctx.fillStyle = '#33ff33';
          ctx.fillRect(20, cursorY - 12, 9, 16);
        }
      }

      // Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let sy = 0; sy < CANVAS_H; sy += 3) {
        ctx.fillRect(0, sy, CANVAS_W, 1);
      }

      // CRT curvature edge darkening
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, 8, CANVAS_H);
      ctx.fillRect(CANVAS_W - 8, 0, 8, CANVAS_H);
      ctx.fillRect(0, 0, CANVAS_W, 5);
      ctx.fillRect(0, CANVAS_H - 5, CANVAS_W, 5);

      screenTexture.needsUpdate = true;
    };

    // ── Animation loop ──
    const clock = new THREE.Clock();
    let animId = 0;
    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      TWEEN.update();

      const elapsed = clock.getElapsedTime();

      // Parallax on desk view
      if (currentKeyRef.current === 'desk') {
        const mx = (mouseRef.current.x - window.innerWidth / 2) * 0.003;
        const my = (mouseRef.current.y - window.innerHeight / 2) * 0.002;
        posRef.current.x += (mx - posRef.current.x) * 0.03;
        posRef.current.y += (18 - my - posRef.current.y) * 0.03;
      }

      // Gentle idle float
      if (currentKeyRef.current === 'idle') {
        const idleKf = KEYFRAMES.idle;
        posRef.current.x = idleKf.pos[0] + Math.sin(elapsed * 0.15) * 30;
        posRef.current.y = idleKf.pos[1] + Math.sin(elapsed * 0.1) * 8;
      }

      // Pulse monitor glow
      monitorGlow.intensity = 6 + Math.sin(elapsed * 2) * 2;

      camera.position.copy(posRef.current);
      camera.lookAt(focRef.current);

      drawScreen(time);
      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      renderer.dispose();
    };
  }, [transition]);

  // ─── Loading done ─────────────────────────────────────────
  const handleStart = useCallback(() => {
    setLoaded(true);
    setShowUI(true);
    transition('idle', 2500);
  }, [transition]);

  return (
    <>
      <div ref={canvasContainerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
        {showUI && <InfoOverlay visible={!inMonitor} />}
      </div>
      {!loaded && <LoadingScreen onStart={handleStart} />}
    </>
  );
}
