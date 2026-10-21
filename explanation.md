# 🌟 Project Explanation: 3D Spatial Computing Portfolio with Vision-Based AR & VR

> **Author:** Aditi Sharma  
> **Course:** Augmented Reality & Virtual Reality (AR/VR) — Semester 7  
> **Repository:** `folio-2025`  
> **Core Concepts:** Non-Immersive Desktop VR, Markerless Vision-Based AR, Natural User Interfaces (NUI), Cross-Reality (XR) Teleoperation, WebAssembly Physics.

---

## 🚀 1. The 30-Second "Elevator Pitch"

> *"This project is an interactive 3D WebGL portfolio that combines **Virtual Reality (VR)** and **Augmented Reality (AR)** directly in the web browser with zero app installation.*  
> *Inside the 3D virtual world, you control a customized avatar (Aditi) exploring real-world AI, Cloud, and Rocketry projects, career milestones, and interactive physics games.*  
> *Through your webcam, it uses **real-time Computer Vision (MediaPipe)** to track your hand with 21 landmarks: you can **steer and drive the 3D character using hand gestures in physical space**, and **rate the portfolio by holding up 1 to 5 fingers**, which renders 3D rotating holographic stars and electric laser beams directly anchored onto your physical fingertips!"*

---

## 🎯 2. What Problem Does This Solve? (The "Why")

Traditional developer portfolios are flat, static, 2D web pages (just scrolling text and cards).  
This project transforms a portfolio into a **living Spatial Computing showcase**:
1. **Interactive Experience:** Instead of reading a PDF resume, visitors physically explore a 3D cyber plaza.
2. **Academic AR/VR Demonstration:** It proves mastery over the complete **Milgram Reality-Virtuality Continuum**:
   - Pure Virtual Reality (synthetic 3D world).
   - Real-World Augmented Reality (superimposing digital 3D holograms onto live physical video).
   - Cross-Reality (XR) coupling (physical hand motions driving virtual world physics).
3. **Frictionless Web Delivery:** It runs anywhere (Mac, PC, iPhone, Android, VR headsets) via standard web technologies (WebGL/WebGPU, WebAssembly, HTML5) without requiring Unity, Unreal Engine, or app-store downloads.

---

## 🌐 3. The Big Picture: Milgram's Reality-Virtuality Continuum

One of the most important concepts in AR/VR is **Milgram's Continuum**:

```
[Real Physical World] <======================> [Augmented Reality (AR)] <======================> [Virtual Reality (VR)]
        │                                                 ▲                                                 ▲
   Webcam Video                                 Webcam Feed + Digital Stars                       100% Synthetic 3D World
  (Your physical room)                         & Directional HUD Vectors                        (Three.js + Rapier3D physics)
```

In this project, both ends and the middle are fully realized:
- **VR Side:** The 3D world is 100% computer-generated geometry, lighting, materials, and physics.
- **AR Side:** The webcam feed captures physical reality, and the browser superimposes 3D rotating stars, electric energy arcs, cockpit crosshairs, and steering vectors anchored to your actual body.
- **Cross-Reality (XR):** Real-world hand displacement vectors directly translate into virtual engine thrust and steering torque.

---

## 🕹️ 4. The 3 Core Experiences in This Project

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                ADITI SHARMA'S PORTFOLIO                                │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ 1. Desktop 3D World (VR) │ 2. Vision AR Hand Teleop    │ 3. Vision AR Finger Rating    │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ • Full 3D Cyber Plaza    │ • Webcam Cockpit Flight HUD │ • 1 to 5 extended fingers     │
│ • Custom Aditi Avatar    │ • Palm Center Tracking      │ • 3D Stars on each fingertip  │
│ • Rapier3D Physics Engine│ • 8% Neutral Deadzone       │ • Laser energy arcs           │
│ • 7 Real Engineering Proj│ • Hand Up = Drive Forward   │ • 850ms Dwell Lock-in         │
│ • Elevating Career Track │ • Hand Down = Reverse       │ • Celebratory Confetti & Audio│
│ • Knockable Bowling Alley│ • Fist = Handbrake          │ • Modal Feedback Review       │
│ • Day/Night & Weather    │ • Open Palm = Nitro Boost   │                               │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## 🖐️ 5. Deep Dive: AR Feature 1 — Hand-Drive Teleoperation (`ARHandController.js`)

### How to use it:
Click the glowing cyan button in the bottom right: **`🖐️ AR Hand Drive`**.  
A sleek **Picture-in-Picture Cockpit Flight HUD** opens in the bottom-left corner with your live webcam stream.

### How it works technically:
1. **21-Landmark Skeletal Detection:**
   Google MediaPipe Hands processes the webcam video feed frame-by-frame inside WebAssembly, extracting 21 $(x, y, z)$ coordinates of your hand.
2. **Palm Center Coordinate:**
   The controller computes the geometric center of your palm by averaging four key joints:
   $$\mathbf{P}_{\text{palm}} = \frac{\mathbf{P}_0 (\text{Wrist}) + \mathbf{P}_5 (\text{Index MCP}) + \mathbf{P}_9 (\text{Middle MCP}) + \mathbf{P}_{17} (\text{Pinky MCP})}{4}$$
3. **The 8% Deadzone (No Unwanted Drifting):**
   A circular zone of radius $r = 8\%$ is placed in the center of the video screen. While your hand stays inside this circle, the car rests in neutral. This prevents natural human hand tremors from accidentally moving the character.
4. **Directional Vector Steering:**
   - **Hand Moved Up:** Calculates negative vertical displacement $(\Delta y < -r) \implies$ Accelerates forward.
   - **Hand Moved Down:** Calculates positive vertical displacement $(\Delta y > +r) \implies$ Reverses / brakes.
   - **Hand Moved Left / Right:** Horizontal displacement $(\Delta x) \implies$ Smooth analog steering.
5. **Special Hand Poses:**
   - **Open Palm 🖐️ (All 5 fingers spread):** Activates **Nitro Boost** with high-speed motion warp lines.
   - **Clenched Fist ✊ (All fingers curled):** Triggers **Emergency Handbrake**, bringing vehicle speed to zero.
6. **Smart Camera Tracking & Fail-Safes:**
   - The Three.js camera smoothly stays locked onto the girl character while driving.
   - **Locate Button:** Re-centers camera onto the character instantly.
   - **Respawn Button:** If you drive off an edge or get stuck in obstacles, this teleports you safely back to the central plaza.

---

## ⭐ 6. Deep Dive: AR Feature 2 — Dynamic Finger-Count Rating (`ARGestureRating.js`)

### How to use it:
Click the magenta floating button: **`✌️ Rate with Gestures`** or **`🖐️ Rate with Fingers (1–5 ⭐)`**.  
Show 1, 2, 3, 4, or 5 fingers to your webcam!

### How it works technically:
1. **Finger Extension Mathematics:**
   For each finger (Index, Middle, Ring, Pinky), the system measures the distance from the fingertip to the wrist ($P_0$) compared to the distance from the middle joint ($P_{\text{pip}}$) to the wrist:
   $$\text{Extended} \iff \text{dist}(P_{\text{tip}}, P_0) > 1.12 \times \text{dist}(P_{\text{pip}}, P_0) \quad \text{and} \quad y_{\text{tip}} < y_{\text{pip}}$$
   For the thumb, it measures lateral spread away from the base of the pinky.
2. **Dynamic 1-to-5 Star Mapping:**
   The total number of currently extended fingers directly equals the rating:
   - 1 Finger = 1 Star ⭐
   - 2 Fingers = 2 Stars ⭐⭐ (Victory sign!)
   - 3 Fingers = 3 Stars ⭐⭐⭐
   - 4 Fingers = 4 Stars ⭐⭐⭐⭐
   - 5 Fingers = 5 Stars ⭐⭐⭐⭐⭐ (Full open hand!)
3. **Spatial 3D Augmentation (The "AR" Element):**
   - **Rotating Golden 3D Stars:** Rendered with real-time perspective and anchored directly onto **every single physical fingertip** in the video feed!
   - **High-Frequency Laser Beam:** A cyan electrical arc continuously connects all active fingertips together.
   - **Floating Holographic HUD:** A futuristic glowing badge floats right above your knuckles showing live star feedback.
4. **850ms Temporal Dwell Lock-in:**
   To make sure a temporary hand twitch doesn't accidentally submit your rating, you must hold your desired finger count steady for **850 milliseconds**.
   Once locked in:
   - A pitch-tuned musical arpeggio plays via Web Audio API.
   - 3D celebration confetti bursts across the screen.
   - A stylish review modal opens with pre-selected tags ready for submission.

---

## 🏛️ 7. Deep Dive: The 3D Virtual Reality World (`Game.js`, `World/`)

When you open the website, you are placed in a rich, living 3D environment:

### 1. The Avatar (Aditi Sharma)
- Instead of an impersonal generic car or box, you control a 3D stylized character representing Aditi Sharma.
- Engineered with custom Three.js mesh geometry: expressive face, natural warm skin tones, dark amber eyes, stylish jacket, boots, and flowing espresso brunette hair.
- Features procedural walking kinematics, dynamic breathing idles, and physics-driven turning tilt.

### 2. Rapier3D Physics Engine (WebAssembly)
- Uses `@dimforge/rapier3d` compiled directly into WebAssembly (WASM).
- Simulates realistic 60 FPS rigid-body momentum, suspension spring damping, tire friction, and physical collisions.
- When you bump into benches, bricks, or bowling pins, kinetic energy transfers realistically.

### 3. Key Zones in the Cyber Plaza:
- **Landing Area:** Giant 3D metallic letters spelling **`ADITI SHARMA`** welcoming the user with interactive start audio.
- **Projects Billboard Area (`ProjectsArea.js`):** A massive 3D electronic screen showing Aditi's real technical projects with live demo/GitHub links:
  1. *Autonomous Clinical Trial Analyst* (Agentic AI with LangGraph, FastAPI, Qdrant)
  2. *Enterprise Cloud Operations Platform* (HCLTech Azure & Kubernetes multi-agent triage)
  3. *Ground Control Visualization Platform* (ISRO CanSat & suborbital rocket telemetry)
  4. *FraudNet Guardian* (FinTech credit card fraud ML with XGBoost & SHAP)
  5. *ZoneLock AI Road Guardian* (Edge AI Computer Vision with YOLOv8 & DeepSORT)
  6. *Risk Scoring & Prioritization Platform* (Predictive ML decision engine)
  7. *Customer Retention Analytics* (Olist 100k+ order RFM segmentation & CLV)
- **Career Milestones Track (`CareerArea.js`):** Six interactive stone slabs that rise dynamically out of the ground as you drive over them, showcasing:
  - *VIT Vellore:* Integrated M.Tech CSE, 9.65 CGPA (Rank 3)
  - *St. Joseph's Convent:* 95.4% School Topper
  - *NDA 149 Merit List:* AIR 417 (Girls Rank 53)
  - *HCLTech:* Software & AI Intern (Azure & LangGraph)
  - *Team Sammard (Rocketry):* CS Senior Core Lead & ISRO CanSat
  - *VIT Student Council:* Member Secretary
- **Arcade Bowling Alley (`BowlingArea.js`):** A fully simulated bowling lane with pins. Colliding with them triggers strike banners, sound effects, and score tracking.
- **Atmospheric Systems:** Real-time Day/Night lighting cycles, procedural fog, blowing wind gusts, floating leaves, rain, snow, and audio ambience.
- **Quick Navigation HUD (`QuickNav.js`):** Top arcade-style buttons that allow instant one-click teleportation to Projects, Career, Bowling, and About sections.

---

## 📱 8. Dedicated Mobile AR (`ar.html`) & Immersive VR (`vr.html`)

In addition to the in-browser webcam AR on the desktop:
- **`ar.html` (Mobile Pass-Through AR):**
  - Opens on iPhone or Android using the phone's back camera.
  - Transparent Three.js WebGL canvas overlays the 3D car and project orbs directly onto your physical desk or floor (Pokemon GO style).
  - Uses the phone's hardware gyroscope for 360° motion tracking.
  - Supports Apple QuickLook USDZ for native iOS AR.
- **`vr.html` (Stereoscopic & WebXR VR):**
  - Dual-mode VR architecture:
    1. **WebXR Immersive Headset Mode:** For Meta Quest 2/3/Pro and Apple Vision Pro.
    2. **Stereoscopic Split-Screen Mode:** Dual-viewport distortion for Google Cardboard and mobile VR phone holders.
  - Hands-free **Gaze Reticle:** Hover your gaze over 3D interactive points for 1.5 seconds to trigger actions without needing a physical controller.

---

## 🛠️ 9. Technology Stack & Why Each Tool Was Chosen

| Technology | Role | Why It Was Chosen Over Alternatives |
| :--- | :--- | :--- |
| **Three.js (r183+)** | 3D Graphics & Rendering | Industry standard for WebGL/WebGPU. Delivers 60 FPS in any browser without plugins. |
| **MediaPipe Hands (Google)** | 21-Landmark Vision Tracking | Runs directly on client hardware (WASM/WebGL). Super fast (30–60 FPS) with zero server latency or cloud API costs. |
| **Rapier3D** | Physics Simulation | Written in Rust and compiled to WebAssembly. Much faster and more deterministic than legacy Cannon.js or Ammo.js. |
| **TSL (Three Shading Language)** | Custom Shaders | Next-gen shader pipeline that compiles seamlessly to both WebGPU and WebGL 2.0. |
| **Web Audio API & Howler** | Sound Design | Synthesizes interactive pitch-tuned audio tones and spatial 3D positional audio. |
| **Vite 7** | Build Tool & Dev Server | Ultra-fast Hot Module Replacement (HMR) with built-in basic-ssl for secure HTTPS webcam access. |
| **GSAP** | Motion & Tweens | Smooth cinematic camera transitions, HUD animations, and UI easing. |

---

## 🏃 10. How to Run, Test, and Verify the Project

### 1. Prerequisites
Ensure [Node.js](https://nodejs.org) is installed on your computer.

### 2. Run the Development Server
Open your terminal inside the project directory:
```bash
cd "/Users/aditisharma/Downloads/sem 7/portfolio/folio-2025"

# Install dependencies (if not already installed)
npm install --force

# Launch secure development server
npm run dev
```

### 3. Open in Browser
- **On Your Computer:** Open `https://localhost:5173/` (or port shown in terminal).  
  *(Accept the local self-signed SSL certificate in your browser to grant webcam access).*
- **On Your Smartphone (Same Wi-Fi):**
  Open the network URL shown in the terminal (e.g., `https://192.168.x.x:5173/ar.html`).

### 4. Verify Git Status & Push
To check if your local code is up-to-date and synced with GitHub:
```bash
git status
git log --oneline -5
```

---

## 🎓 11. Professor Viva & Presentation Q&A Cheat Sheet

Here are the exact questions professors love to ask during AR/VR project evaluations, along with the ideal academic answers:

### Q1: *"How does this project prove both AR and VR?"*
> **Answer:**  
> *"It demonstrates both sides of Milgram's Reality-Virtuality Continuum:  
> 1. **Virtual Reality:** The 3D cyber plaza is a complete synthetic virtual environment with continuous 3D spatial agency, perspective projection, motion parallax, and Rapier3D rigid-body physics.  
> 2. **Augmented Reality:** The camera viewport superimposes digital 3D holographic stars, energy arcs, deadzone rings, and directional vectors directly onto the user's physical body in real time based on 21-landmark optical tracking."*

### Q2: *"Is hand tracking just Computer Vision, or is it true Augmented Reality?"*
> **Answer:**  
> *"Computer Vision is the **input detection layer** (MediaPipe calculating the 21 coordinate points of the hand). Augmented Reality is the **spatial output layer**: anchoring synthetic 3D geometry (rotating holographic stars, electric energy arcs, cockpit HUDs) onto real-world coordinates in the live video stream."*

### Q3: *"How does controlling the 3D avatar with hand gestures qualify as AR/VR?"*
> **Answer:**  
> *"In spatial computing literature, this is classified as **Cross-Reality (XR) Teleoperation and Video See-Through (VST) Augmented Reality**. The physical webcam feed is augmented with dynamic 3D directional vectors, deadzone calibration rings, and telemetry overlays, directly bridging physical human kinematics into the synthetic 3D virtual environment."*

### Q4: *"How do you prevent hand jitter from causing vehicle drift or false ratings?"*
> **Answer:**  
> *"Through a dual-filter architecture:  
> 1. **Radial Deadzone Filter:** In Hand Drive mode, an 8% circular neutral zone around screen center ignores natural hand tremor.  
> 2. **Temporal Dwell Accumulator:** In rating mode, the user must hold the finger gesture steady for 850 milliseconds before triggering submission, eliminating accidental flashes."*

### Q5: *"Why did you use WebGL/Three.js instead of Unity or Unreal?"*
> **Answer:**  
> *"Web-based spatial computing provides **zero-friction universal accessibility**. Any user on any device can open a single URL and experience full 3D physics and computer vision without downloading multi-gigabyte apps or requiring proprietary hardware."*

---

## 📂 12. Key File Directory (Where Everything Lives)

```
folio-2025/
├── sources/
│   ├── index.html                  # Main WebGL desktop entry point
│   ├── index.js                    # Game bootstrap
│   ├── ar.html & ar.js             # Dedicated mobile camera pass-through AR experience
│   ├── vr.html & vr.js             # Dedicated WebXR & stereoscopic split-screen VR experience
│   │
│   ├── Game/
│   │   ├── Game.js                 # Master orchestrator connecting all systems
│   │   ├── Player.js               # Player kinematics & AR controller bridge
│   │   ├── ARHandController.js     # 🖐️ AR Hand Drive & Cockpit Flight HUD
│   │   ├── ARGestureRating.js      # ⭐ 1-5 Finger Count AR Rating & 3D Stars
│   │   ├── QuickNav.js             # Top arcade HUD navigation bar
│   │   ├── Audio.js                # Web Audio API sound synthesizer
│   │   │
│   │   ├── World/
│   │   │   ├── VisualVehicle.js    # 3D Aditi avatar mesh, hair, and procedural walking
│   │   │   └── Areas/
│   │   │       ├── ProjectsArea.js # Interactive 3D Projects Billboard
│   │   │       ├── CareerArea.js   # Elevating career milestone stone track
│   │   │       ├── BowlingArea.js  # Rapier3D physics bowling alley
│   │   │       └── LandingArea.js  # 3D "ADITI SHARMA" intro plaza
│   │
│   └── data/
│       ├── projects.js             # Aditi's engineering projects data
│       └── achievements.js         # In-game unlockable achievements
│
├── package.json                    # Project dependencies & scripts
├── vite.config.js                  # Vite server & SSL configuration
└── explanation.md                  # This complete documentation guide
```

---

*This document contains everything you need to understand, demonstrate, and defend this project with full confidence!*
