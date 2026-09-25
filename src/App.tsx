import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import * as TWEEN from '@tweenjs/tween.js';
import { LoadingScreen } from './components/LoadingScreen';
import { InfoOverlay } from './components/InfoOverlay';

// ─── Camera keyframes ──────────────────────────────────────
const KEYFRAMES = {
  loading:  { pos: [-350, 350, 350], foc: [0, -50, 0] },
  idle:     { pos: [-200, 120, 200], foc: [0, -10, 0] },
  desk:     { pos: [0, 18, 55],      foc: [0, 5, 0] },
  monitor:  { pos: [0, 9.5, 20],     foc: [0, 9.5, 0] },
};

export default function App() {
  const cssLayerRef = useRef<HTMLDivElement>(null);
  const webglLayerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cssSceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cssRendererRef = useRef<CSS3DRenderer | null>(null);

  const currentKeyRef = useRef('loading');
  const posRef = useRef(new THREE.Vector3(...KEYFRAMES.loading.pos as [number, number, number]));
  const focRef = useRef(new THREE.Vector3(...KEYFRAMES.loading.foc as [number, number, number]));
  const mouseRef = useRef({ x: 0, y: 0 });
  const inMonitorRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [inMonitor, setInMonitor] = useState(false);

  // ─── Transition helper ────────────────────────────────────
  const transition = useCallback((key: keyof typeof KEYFRAMES, duration = 1000) => {
    if (currentKeyRef.current === key) return;
    TWEEN.removeAll();
    currentKeyRef.current = key;
    const kf = KEYFRAMES[key];
    new TWEEN.Tween(posRef.current)
      .to({ x: kf.pos[0], y: kf.pos[1], z: kf.pos[2] }, duration)
      .easing(TWEEN.Easing.Quintic.InOut)
      .start();
    new TWEEN.Tween(focRef.current)
      .to({ x: kf.foc[0], y: kf.foc[1], z: kf.foc[2] }, duration)
      .easing(TWEEN.Easing.Quintic.InOut)
      .start();
  }, []);

  // ─── Build scene ──────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    const cssScene = cssSceneRef.current;

    // Camera
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 9000);
    camera.position.copy(posRef.current);
    cameraRef.current = camera;

    // WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.pointerEvents = 'none';
    webglLayerRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // CSS3D renderer
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssLayerRef.current?.appendChild(cssRenderer.domElement);
    cssRendererRef.current = cssRenderer;

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const spot = new THREE.SpotLight(0xfff4e0, 80, 200, 0.4, 0.7);
    spot.position.set(10, 40, 30);
    spot.castShadow = true;
    scene.add(spot);
    const warm = new THREE.PointLight(0xff9944, 15, 60);
    warm.position.set(-15, 15, 10);
    scene.add(warm);

    // ── Floor ──
    const floorGeo = new THREE.PlaneGeometry(600, 600);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.95 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    scene.add(floor);

    // ── Desk ──
    const deskColor = 0x3d2b1f;
    // Tabletop
    const topGeo = new THREE.BoxGeometry(50, 0.8, 25);
    const topMat = new THREE.MeshStandardMaterial({ color: deskColor, roughness: 0.7, metalness: 0.1 });
    const tabletop = new THREE.Mesh(topGeo, topMat);
    tabletop.position.set(0, 0, 0);
    scene.add(tabletop);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
    const legPositions = [[-23, -5, -10], [23, -5, -10], [-23, -5, 10], [23, -5, 10]];
    legPositions.forEach(p => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(p[0], p[1], p[2]);
      scene.add(leg);
    });

    // ── Monitor (CRT Style) ──
    const monGroup = new THREE.Group();
    monGroup.position.set(0, 0.4, 0);

    // Back casing (deep)
    const casingGeo = new THREE.BoxGeometry(18, 14, 12);
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xd8d0c4, roughness: 0.85 });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.position.set(0, 7.5, -3);
    monGroup.add(casing);

    // Front bezel
    const bezelGeo = new THREE.BoxGeometry(17, 13, 0.5);
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0xc0b8a8, roughness: 0.7 });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 7.5, 3.2);
    monGroup.add(bezel);

    // Screen inset (black)
    const screenGeo = new THREE.PlaneGeometry(15.5, 11.5);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 7.5, 3.46);
    monGroup.add(screenMesh);

    // GL occlusion plane (makes CSS3D hidden behind objects)
    const glPlaneMat = new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
      opacity: 0,
      transparent: true,
      blending: THREE.NoBlending,
    });
    const glPlane = new THREE.Mesh(new THREE.PlaneGeometry(15.5, 11.5), glPlaneMat);
    glPlane.position.set(0, 7.5, 3.47);
    monGroup.add(glPlane);

    // Monitor stand
    const standGeo = new THREE.CylinderGeometry(2.5, 3.5, 1.2, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0xd8d0c4, roughness: 0.8 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, 0.2, 0);
    monGroup.add(stand);

    scene.add(monGroup);

    // ── CSS3D Screen Content (the OS) ──
    const SCREEN_W = 1024;
    const SCREEN_H = 768;

    const container = document.createElement('div');
    container.style.width = SCREEN_W + 'px';
    container.style.height = SCREEN_H + 'px';
    container.style.background = '#0a1a1a';
    container.className = 'jitter';

    // Build HTML OS
    const osRoot = document.createElement('div');
    osRoot.id = 'os-root';
    osRoot.style.cssText = `
      width: 100%; height: 100%; font-family: 'Share Tech Mono', monospace;
      color: #33ff33; background: radial-gradient(circle, #0a2020 0%, #000 100%);
      display: flex; flex-direction: column; overflow: hidden; position: relative;
      box-shadow: inset 0 0 80px rgba(0,255,100,0.08);
    `;

    // Scanline overlay inside screen
    const scanDiv = document.createElement('div');
    scanDiv.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      background: repeating-linear-gradient(0deg,rgba(0,255,0,0.06) 0px,rgba(0,255,0,0.06) 1px,transparent 1px,transparent 3px);
      pointer-events:none;z-index:999;
    `;
    osRoot.appendChild(scanDiv);

    // Desktop icons
    const iconsDiv = document.createElement('div');
    iconsDiv.style.cssText = 'padding:20px;display:flex;flex-direction:column;gap:16px;z-index:10;position:relative;';
    const icons = [
      { label: 'GitHub', icon: '⌘', url: 'https://github.com/jiya2000' },
      { label: 'LinkedIn', icon: '▦', url: 'https://linkedin.com/in/aditisharma' },
      { label: 'Email', icon: '@', action: 'email' },
    ];
    icons.forEach(ic => {
      const btn = document.createElement('button');
      btn.style.cssText = `
        display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:#33ff33;font-family:inherit;
      `;
      btn.innerHTML = `
        <div style="width:48px;height:48px;border:2px solid #33ff33;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(0,0,0,0.8);border-radius:4px;">${ic.icon}</div>
        <span style="font-size:11px;background:#000;padding:1px 6px;border:1px solid #1a6633;">${ic.label}</span>
      `;
      btn.onclick = () => {
        if (ic.action === 'email') {
          window.open('mailto:aditisharma20004@gmail.com');
        } else if (ic.url) {
          window.open(ic.url, '_blank');
        }
      };
      iconsDiv.appendChild(btn);
    });
    osRoot.appendChild(iconsDiv);

    // Terminal window
    const termWin = document.createElement('div');
    termWin.style.cssText = `
      position:absolute;top:30px;left:180px;width:780px;height:520px;
      background:rgba(0,0,0,0.95);border:2px solid #33ff33;
      box-shadow:0 0 30px rgba(0,255,0,0.3);display:flex;flex-direction:column;z-index:20;
    `;
    // Title bar
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      height:32px;background:#0a3a0a;border-bottom:2px solid #33ff33;display:flex;align-items:center;
      justify-content:space-between;padding:0 10px;color:#fff;font-size:13px;
    `;
    titleBar.innerHTML = '<span>⬛ aditi@portfolio:~$ k8s_agent_monitor.sh</span><span style="cursor:pointer;">✕</span>';
    termWin.appendChild(titleBar);

    // Terminal body
    const termBody = document.createElement('div');
    termBody.style.cssText = 'flex:1;padding:12px;overflow-y:auto;font-size:13px;line-height:1.6;';
    termWin.appendChild(termBody);
    osRoot.appendChild(termWin);

    // Taskbar
    const taskbar = document.createElement('div');
    taskbar.style.cssText = `
      height:36px;background:#0a1a0a;border-top:2px solid #33ff33;margin-top:auto;display:flex;
      align-items:center;padding:0 12px;position:relative;z-index:30;
    `;
    taskbar.innerHTML = `
      <div style="font-weight:bold;font-size:14px;background:#33ff33;color:#000;padding:2px 16px;cursor:pointer;">START</div>
      <div style="margin-left:auto;color:#33ff33;font-size:12px;">SHARMA_OS v2.0</div>
    `;
    osRoot.appendChild(taskbar);

    container.appendChild(osRoot);

    // Create CSS3D object
    const cssObj = new CSS3DObject(container);
    const scaleFactor = 15.5 / SCREEN_W;
    cssObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
    cssObj.position.set(0, 7.5, 3.48);
    cssObj.rotation.set(-3 * THREE.MathUtils.DEG2RAD, 0, 0);
    cssScene.add(cssObj);

    // Terminal typewriter effect
    const LOGS = [
      "Initializing Sharma Operating System (SOS)...",
      "Booting HCLTech Enterprise Multi-Agent Cloud Platform...",
      "--> Connecting to Azure Kubernetes Service... ",
      "SUCCESS: Authenticated as aditi.sharma@hcltech.com",
      "",
      "Agent [FinOps]    online. Optimizing resource allocation...",
      "Agent [Security]  online. Running compliance checks... PASS",
      "Agent [Ops]       online. Monitoring telemetry endpoints...",
      "",
      "═══════════════════════════════════════════════════",
      " CANDIDATE PROFILE: Aditi Sharma",
      "═══════════════════════════════════════════════════",
      "",
      " > Education:  M.Tech CSE (Data Science) — VIT",
      " > CGPA:       9.65 / 10.0",
      " > NDA:        AIR 417",
      " > Arts:       Classical Kathak Dancer",
      "",
      "───────────────────────────────────────────────────",
      " EXPERIENCE",
      "───────────────────────────────────────────────────",
      "",
      " > HCLTech | SDE — Multi-Agent Cloud Platform",
      "   Designed autonomous K8s agents (FinOps,",
      "   Security, Ops) on Azure AKS. Built CI/CD",
      "   pipeline monitoring with real-time alerts.",
      "",
      " > Samsung R&D | SDE — On-Device AI",
      "   Optimized ONNX model inference on Exynos NPU.",
      "   Reduced latency 34% for vision pipeline.",
      "",
      "───────────────────────────────────────────────────",
      " PROJECTS",
      "───────────────────────────────────────────────────",
      "",
      " > ClaimGraphAI — Patent NLP Engine",
      "   Graph-RAG patent claim optimizer.",
      "   Dependency parsing + prior art detection.",
      "",
      " > Clinical Trial RAG System",
      "   Autonomous doc parsing with 95% retrieval",
      "   accuracy. Built on LangChain + FAISS.",
      "",
      " > Student Data Analytics Pipeline",
      "   End-to-end ETL + dashboard for 50K+ records.",
      "",
      "═══════════════════════════════════════════════════",
      " System Ready. All agents operational.",
      " Awaiting input...",
    ];

    let lineIdx = 0;
    const typeInterval = setInterval(() => {
      if (lineIdx < LOGS.length) {
        const line = LOGS[lineIdx];
        const div = document.createElement('div');
        if (line.includes('SUCCESS') || line.includes('PASS')) {
          div.style.color = '#44aaff';
          div.style.fontWeight = 'bold';
        } else if (line.includes('═══') || line.includes('───')) {
          div.style.color = '#1a6633';
        } else if (line.startsWith(' >') || line.startsWith('-->')) {
          div.style.color = '#ffcc44';
        } else if (line.includes('CANDIDATE PROFILE')) {
          div.style.cssText = 'color:#fff;font-weight:bold;background:#0a3a0a;padding:2px 8px;';
        }
        div.textContent = line || '\u00A0';
        termBody.appendChild(div);
        termBody.scrollTop = termBody.scrollHeight;
        lineIdx++;
      } else {
        clearInterval(typeInterval);
        const cursor = document.createElement('div');
        cursor.className = 'blinking-cursor';
        cursor.style.cssText = 'width:8px;height:14px;background:#33ff33;margin-top:8px;';
        termBody.appendChild(cursor);
      }
    }, 120);

    // ── Keyboard ──
    const kbGroup = new THREE.Group();
    kbGroup.position.set(0, 0.45, 9);
    const kbBase = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.4, 5),
      new THREE.MeshStandardMaterial({ color: 0xd8d0c4, roughness: 0.8 })
    );
    kbGroup.add(kbBase);
    // Keys
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        const key = new THREE.Mesh(
          new THREE.BoxGeometry(0.9, 0.3, 0.9),
          new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.6 })
        );
        key.position.set(-5.5 + col * 1.05, 0.35, -1.5 + row * 1.15);
        kbGroup.add(key);
      }
    }
    scene.add(kbGroup);

    // ── Mouse ──
    const mouseGeo = new THREE.BoxGeometry(2, 0.6, 3);
    const mouseMesh = new THREE.Mesh(mouseGeo, new THREE.MeshStandardMaterial({ color: 0xd8d0c4, roughness: 0.8 }));
    mouseMesh.position.set(12, 0.7, 9);
    scene.add(mouseMesh);

    // ── Coffee mug ──
    const mugGroup = new THREE.Group();
    mugGroup.position.set(-18, 0.4, 6);
    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1, 3, 16),
      new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.7 })
    );
    mugBody.position.y = 1.5;
    mugGroup.add(mugBody);
    const coffee = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x3d1c02 })
    );
    coffee.position.y = 2.9;
    mugGroup.add(coffee);
    // Handle
    const handleGeo = new THREE.TorusGeometry(0.7, 0.15, 8, 12, Math.PI);
    const handle = new THREE.Mesh(handleGeo, new THREE.MeshStandardMaterial({ color: 0xf5f5dc }));
    handle.position.set(1.3, 1.8, 0);
    handle.rotation.z = -Math.PI / 2;
    mugGroup.add(handle);
    scene.add(mugGroup);

    // ── Wall behind ──
    const wallGeo = new THREE.PlaneGeometry(600, 300);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1c1c26, roughness: 0.95 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 150, -80);
    scene.add(wall);

    // ── Mouse interaction for camera ──
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Check if mouse is in the CSS3D iframe area  
      const target = e.target as HTMLElement;
      const isOS = target.closest('#os-root') !== null;
      
      if (isOS && !inMonitorRef.current) {
        inMonitorRef.current = true;
        setInMonitor(true);
        transition('monitor', 2000);
      } else if (!isOS && inMonitorRef.current) {
        inMonitorRef.current = false;
        setInMonitor(false);
        transition('desk');
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isOS = target.closest('#os-root') !== null;
      if (isOS) return; // let clicks inside OS pass through
      
      e.preventDefault();
      if (currentKeyRef.current === 'idle') {
        transition('desk');
      } else if (currentKeyRef.current === 'desk') {
        transition('idle');
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ──
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();

      // Parallax on desk view
      if (currentKeyRef.current === 'desk') {
        const mx = (mouseRef.current.x - window.innerWidth / 2) * 0.003;
        const my = (mouseRef.current.y - window.innerHeight / 2) * 0.002;
        posRef.current.x += (mx - posRef.current.x) * 0.02;
        posRef.current.y += (18 - my - posRef.current.y) * 0.02;
      }

      // Gentle idle orbit
      if (currentKeyRef.current === 'idle') {
        const t = clock.getElapsedTime();
        posRef.current.x = Math.sin(t * 0.08) * KEYFRAMES.idle.pos[0];
      }

      camera.position.copy(posRef.current);
      camera.lookAt(focRef.current);

      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      renderer.dispose();
    };
  }, [transition]);

  // ─── Loading finished handler ─────────────────────────────
  const handleStart = useCallback(() => {
    setLoaded(true);
    setShowUI(true);
    transition('idle', 2500);
  }, [transition]);

  return (
    <>
      <div className="scanlines" />
      <div id="css-layer" ref={cssLayerRef} />
      <div id="webgl-layer" ref={webglLayerRef} />
      <div id="ui-layer">
        {showUI && <InfoOverlay visible={!inMonitor} />}
      </div>
      {!loaded && <LoadingScreen onStart={handleStart} />}
    </>
  );
}
