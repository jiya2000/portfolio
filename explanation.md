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
   - **Pure Virtual Reality:** 100% synthetic 3D world with rigid-body physics.
   - **Real-World Augmented Reality:** Superimposing digital 3D holograms onto live physical video.
   - **Cross-Reality (XR) coupling:** Physical hand motions driving virtual world physics.
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
- **VR Side (`sources/Game/World/`):** The 3D world is 100% computer-generated geometry, lighting, materials, and physics.
- **AR Side (`sources/Game/ARGestureRating.js` & `sources/Game/ARHandController.js`):** The webcam feed captures physical reality, and the browser superimposes 3D rotating stars, electric energy arcs, cockpit crosshairs, and steering vectors anchored to your actual body.
- **Cross-Reality (XR) Coupling (`sources/Game/Player.js`):** Real-world hand displacement vectors directly translate into virtual engine thrust and steering torque.

---

## 🕹️ 4. The 3 Core Experiences & Their Performing Files

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     ADITI SHARMA'S PORTFOLIO                                     │
├──────────────────────────────┬──────────────────────────────────┬────────────────────────────────┤
│ 1. Desktop 3D World (VR)     │ 2. Vision AR Hand Teleop         │ 3. Vision AR Finger Rating     │
├──────────────────────────────┼──────────────────────────────────┼────────────────────────────────┤
│ • Full 3D Cyber Plaza        │ • Webcam Cockpit Flight HUD      │ • 1 to 5 extended fingers      │
│ • Custom Aditi Avatar        │ • Palm Center Tracking           │ • 3D Stars on each fingertip   │
│ • Rapier3D Physics Engine    │ • 8% Neutral Deadzone            │ • Laser energy arcs            │
│ • 7 Real Engineering Proj    │ • Hand Up = Drive Forward        │ • 850ms Dwell Lock-in          │
│ • Elevating Career Track     │ • Hand Down = Reverse            │ • Celebratory Confetti & Audio │
│ • Knockable Bowling Alley    │ • Fist = Handbrake               │ • Modal Feedback Review        │
│ • Day/Night & Weather        │ • Open Palm = Nitro Boost        │                                │
├──────────────────────────────┼──────────────────────────────────┼────────────────────────────────┤
│ 📁 PERFORMING FILES:         │ 📁 PERFORMING FILES:             │ 📁 PERFORMING FILES:           │
│ • sources/Game/Game.js       │ • sources/Game/ARHandController  │ • sources/Game/ARGestureRating │
│ • sources/Game/Player.js     │ • sources/Game/Player.js         │ • sources/style/arGestureRating│
│ • sources/Game/World/Visual  │ • sources/Game/View.js           │                                │
│   Vehicle.js                 │ • sources/style/arHandController │                                │
│ • sources/Game/World/Areas/* │                                  │                                │
└──────────────────────────────┴──────────────────────────────────┴────────────────────────────────┘
```

---

## 🖐️ 5. Deep Dive: AR Feature 1 — Hand-Drive Teleoperation

- 📁 **Primary File:** [`sources/Game/ARHandController.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARHandController.js) (Class: `ARHandController`)
- 📁 **Physics/Input Bridge:** [`sources/Game/Player.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Player.js) (Lines 575–600 in `updatePrePhysics()`)
- 📁 **Camera Tracking Logic:** [`sources/Game/View.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/View.js) (Lines 590–625 in focus point updates)
- 📁 **Styling & HUD CSS:** [`sources/style/arHandController.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/arHandController.styl)

### How to use it:
Click the glowing cyan button in the bottom right: **`🖐️ AR Hand Drive`** (created in `ARHandController.initDOM()`).  
A sleek **Picture-in-Picture Cockpit Flight HUD** opens in the bottom-left corner with your live webcam stream.

### How it works technically:
1. **Camera Stream & MediaPipe Pipeline:**
   - Handled in `ARHandController.start()` and `ARHandController.initHands()`.
   - Google MediaPipe Hands evaluates the webcam video frame-by-frame inside WebAssembly, returning 21 three-dimensional coordinate landmarks $(x, y, z)$ on the user's hand at 30–60 FPS.
2. **Palm Center Coordinate Calculation:**
   - Handled in `ARHandController.processHand()`:
   $$\mathbf{P}_{\text{palm}} = \frac{\mathbf{P}_0 (\text{Wrist}) + \mathbf{P}_5 (\text{Index MCP}) + \mathbf{P}_9 (\text{Middle MCP}) + \mathbf{P}_{17} (\text{Pinky MCP})}{4}$$
3. **The 8% Radial Deadzone (Prevents Hand Tremor):**
   - Configured via `this.deadzoneRadius = 0.08` at screen center $(0.5, 0.5)$.
   - If the palm is within $8\%$ of the screen center, the controller remains in neutral (`accelerating = 0`, `steering = 0`), preventing natural resting hand tremors from causing accidental vehicle drift.
4. **Directional Vector Steering:**
   - Handled in `ARHandController.processHand()`:
   - **Hand Raised Above Center ($\Delta y < -r$):** Generates positive forward throttle `accelerating = min(1.0, ...)`.
   - **Hand Lowered Below Center ($\Delta y > +r$):** Generates reverse / braking torque `accelerating = -min(1.0, ...)`.
   - **Hand Moved Left / Right ($\Delta x$):** Computes smooth analog steering angle `this.steering`.
5. **Special Hand Poses:**
   - **Open Palm 🖐️ (All 5 fingers extended):** `this.boosting = 1` activates Nitro Turbo Boost and triggers high-speed Three.js motion warp lines (handled in `sources/Game/View.js`).
   - **Clenched Fist ✊ (All fingers curled):** `this.braking = 1` stops vehicle momentum immediately.
6. **Cross-Reality (XR) Bridge to the 3D World:**
   - In [`sources/Game/Player.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Player.js), the game loop reads `this.game.arHandController` on every tick and applies the hand telemetry directly to the Rapier3D vehicle chassis forces.
7. **Smart Camera Tracking & Fail-Safes:**
   - In [`sources/Game/View.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/View.js), the camera automatically stays locked onto the girl character while driving with gestures.
   - **🎯 Locate Button:** In `ARHandController.js`, clicking "Locate" snaps the 3D camera back to the character.
   - **🔄 Respawn Button:** In `ARHandController.js`, clicking "Respawn" teleports the character safely back to the landing plaza if you drive into deep obstacles.

---

## ⭐ 6. Deep Dive: AR Feature 2 — Dynamic Finger-Count Rating

- 📁 **Primary File:** [`sources/Game/ARGestureRating.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARGestureRating.js) (Class: `ARGestureRating`)
- 📁 **Styling & Particle CSS:** [`sources/style/arGestureRating.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/arGestureRating.styl)
- 📁 **Instantiated in:** [`sources/Game/Game.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Game.js) (Line 206: `this.arGestureRating = new ARGestureRating()`)

### How to use it:
Click the magenta floating button in the bottom right: **`✌️ Rate with Gestures`** or **`🖐️ Rate with Fingers (1–5 ⭐)`**.  
Show 1, 2, 3, 4, or 5 fingers to your webcam!

### How it works technically:
1. **Real-Time Finger Extension Algorithm:**
   - Handled in `ARGestureRating.countExtendedFingers()`:
   - For Index, Middle, Ring, and Pinky fingers, it calculates the Euclidean distance from the fingertip ($P_{\text{tip}}$) to the wrist ($P_0$) and compares it to the PIP joint distance:
     $$\text{Extended} \iff \text{dist}(P_{\text{tip}}, P_0) > 1.12 \times \text{dist}(P_{\text{pip}}, P_0) \quad \text{and} \quad y_{\text{tip}} < y_{\text{pip}}$$
   - For the Thumb, it measures lateral displacement away from the base of the pinky ($P_{17}$).
2. **Dynamic 1-to-5 Star Rating Mapping:**
   - The number of active extended fingers directly sets the star rating in real time:
     - 1 Finger = 1 Star ⭐
     - 2 Fingers = 2 Stars ⭐⭐ (Victory / Peace symbol)
     - 3 Fingers = 3 Stars ⭐⭐⭐
     - 4 Fingers = 4 Stars ⭐⭐⭐⭐
     - 5 Fingers = 5 Stars ⭐⭐⭐⭐⭐ (Full open palm)
3. **Spatial 3D Augmentation (The Core AR Experience):**
   - Handled in `ARGestureRating.drawHandAugmentations()`:
   - **Multi-Fingertip 3D Rotating Stars:** A golden, rotating 3D holographic star is spatially rendered and anchored onto **every single extended fingertip** in real-time camera space!
   - **Electric Laser Arc:** High-frequency electrical energy beams dynamically connect all active extended fingertips together.
   - **Floating Holographic HUD:** A glowing badge floats directly above your hand displaying real-time feedback (e.g., `⭐⭐⭐⭐⭐ (5 STARS)`).
4. **850ms Temporal Dwell Lock-in:**
   - Handled in `ARGestureRating.update()` via `this.holdTimer`:
   - To ensure intentional rating rather than a passing motion, the user must hold their finger count steady for **850 milliseconds**.
   - Upon confirmation:
     - Pitch-tuned musical chords play via Web Audio API (`ARGestureRating.playStarChime()`).
     - Celebratory 3D confetti particles explode across the screen (`ARGestureRating.spawnConfetti()`).
     - An interactive review modal opens with pre-selected tags and feedback comments.

---

## 🏛️ 7. Deep Dive: The 3D Virtual Reality World & Areas

- 📁 **Master Engine Orchestrator:** [`sources/Game/Game.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Game.js)
- 📁 **HTML Entry Point:** [`sources/index.html`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/index.html)
- 📁 **JS Bootstrap:** [`sources/index.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/index.js)

When you open the website, you are placed into a living 3D synthetic universe:

### 1. The Avatar (Aditi Sharma)
- 📁 **Mesh & Visuals:** [`sources/Game/World/VisualVehicle.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/VisualVehicle.js) (Method: `createCharacter()`, Lines 58–320)
- 📁 **Kinematics & Control:** [`sources/Game/Player.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Player.js)
- Replaces a generic car or static model with a custom 3D stylized character representing Aditi Sharma.
- Engineered with custom Three.js mesh geometry: expressive eyes with specular highlights, natural warm skin tones, stylish jacket, boots, and flowing espresso brunette hair.
- Features procedural walking animations, idle breathing cycles, and physics-driven turn-tilting.

### 2. Rapier3D Physics Engine (WebAssembly)
- 📁 **Physics Core:** [`sources/Game/Physics/Physics.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Physics/Physics.js)
- 📁 **Vehicle Raycast Chassis:** [`sources/Game/Physics/PhysicalVehicle.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Physics/PhysicalVehicle.js)
- 📁 **Library Dependency:** `@dimforge/rapier3d` in [`package.json`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/package.json)
- Runs deterministic 60 Hz physics in WebAssembly (WASM).
- 4 downward raycasts compute real-time suspension spring compression, tire friction, and Ackerman steering.
- Handles dynamic momentum transfer and rigid-body collisions with benches, bricks, and bowling pins.

### 3. Key Zones in the Cyber Plaza:

#### A. Landing Area (Entrance Plaza)
- 📁 **Source File:** [`sources/Game/World/Areas/LandingArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/LandingArea.js)
- Renders giant 3D chrome metallic letters spelling **`ADITI SHARMA`** directly into the scene.
- Welcomes the visitor with interactive audio and click-to-start controls.

#### B. Projects Billboard Area
- 📁 **Source File:** [`sources/Game/World/Areas/ProjectsArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/ProjectsArea.js)
- 📁 **Project Data Source:** [`sources/data/projects.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/data/projects.js)
- A massive 3D electronic blackboard/screen rendering real engineering projects directly on the 3D surface:
  1. *Autonomous Clinical Trial Analyst* (Agentic AI with LangGraph, FastAPI, Qdrant)
  2. *Enterprise Cloud Operations Platform* (HCLTech Azure & Kubernetes multi-agent triage)
  3. *Ground Control Visualization Platform* (ISRO CanSat & suborbital rocket telemetry)
  4. *FraudNet Guardian* (FinTech credit card fraud ML with XGBoost & SHAP)
  5. *ZoneLock AI Road Guardian* (Edge AI Computer Vision with YOLOv8 & DeepSORT)
  6. *Risk Scoring & Prioritization Platform* (Predictive ML decision engine)
  7. *Customer Retention Analytics* (Olist 100k+ order RFM segmentation & CLV)
- Includes live GitHub repository links and interactive 3D pagination.

#### C. Career Milestones Track
- 📁 **Source File:** [`sources/Game/World/Areas/CareerArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/CareerArea.js)
- 6 interactive stone pillars that physically elevate out of the ground when the avatar approaches or drives over them:
  - *VIT Vellore:* Integrated M.Tech CSE, 9.65 CGPA (Rank 3)
  - *St. Joseph's Convent:* 95.4% School Topper
  - *NDA 149 Merit List:* AIR 417 (Girls Rank 53)
  - *HCLTech:* Software & AI Intern (Azure & LangGraph)
  - *Team Sammard (Rocketry):* CS Senior Core Lead & ISRO CanSat
  - *VIT Student Council:* Member Secretary

#### D. Arcade Bowling Alley
- 📁 **Source File:** [`sources/Game/World/Areas/BowlingArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/BowlingArea.js)
- A fully simulated 3D bowling lane with Rapier3D rigid-body pins.
- Driving into the pins transfers kinetic energy, knocking them over, tracking score, and displaying celebratory strike banners.

#### E. Atmospheric & Audio Systems
- 📁 **Audio Synthesizer:** [`sources/Game/Audio.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Audio.js) (Web Audio API & Howler.js)
- 📁 **Day/Night Lighting Cycles:** [`sources/Game/World/DayCycles.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/DayCycles.js) & [`sources/Game/Ligthing.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Ligthing.js)
- 📁 **Weather & Particles:** [`sources/Game/World/Weather.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Weather.js), [`sources/Game/World/Leaves.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Leaves.js), [`sources/Game/World/RainLines.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/RainLines.js), [`sources/Game/World/Snow.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Snow.js)

#### F. Quick Navigation Arcade HUD
- 📁 **Source File:** [`sources/Game/QuickNav.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/QuickNav.js)
- 📁 **HTML Structure:** [`sources/index.html`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/index.html) (Nav buttons with `.js-quick-nav`)
- Arcade HUD bar anchored to the top of the screen allowing instant one-click teleportation to Projects, Career, Bowling, Lab, and About sections.

---

## 📱 8. Dedicated Mobile AR & WebXR VR Modes

In addition to the in-browser webcam AR on the desktop:

### 1. Dedicated Mobile Pass-Through AR
- 📁 **HTML Template:** [`sources/ar.html`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/ar.html)
- 📁 **Logic & Tracking:** [`sources/ar.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/ar.js)
- 📁 **Styling:** [`sources/style/arExperience.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/arExperience.styl)
- **Features:**
  - Designed for mobile phones (iPhone / Android) using the rear camera stream.
  - Transparent Three.js WebGL canvas overlays the 3D car and project orbs directly into your real room (Pokemon GO style).
  - Uses device orientation sensors and gyroscope for full 360° motion tracking.
  - Native iOS QuickLook integration via USDZ 3D models.

### 2. Dedicated Stereoscopic & WebXR VR
- 📁 **HTML Template:** [`sources/vr.html`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/vr.html)
- 📁 **Logic & Gaze Tracking:** [`sources/vr.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/vr.js)
- 📁 **Styling:** [`sources/style/vrExperience.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/vrExperience.styl)
- **Features:**
  - **Dual-Mode VR Architecture:**
    1. *WebXR Immersive Mode:* For Meta Quest 2/3/Pro, HTC Vive, and Apple Vision Pro.
    2. *Stereoscopic Split-Screen Mode:* Dual-viewport side-by-side rendering with barrel distortion for Google Cardboard and mobile VR phone clips.
  - **Hands-Free Gaze Reticle:** Dwells on 3D interactive points for 1.5 seconds to trigger selections without needing physical handheld controllers.

### 3. AR/VR Network QR Code Launcher
- 📁 **Source File:** [`sources/Game/AR.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/AR.js)
- Generates a dynamic QR code encoded with your local Wi-Fi IP address so smartphones on the same network can scan and launch the mobile AR/VR experience instantly.

---

## 🛠️ 9. Technology Stack & Why Each Tool Was Chosen

| Technology | Role | Where Used in Code | Why It Was Chosen Over Alternatives |
| :--- | :--- | :--- | :--- |
| **Three.js (r183+)** | 3D Graphics & Rendering | All files in `sources/Game/` | Industry standard for WebGL/WebGPU. Delivers 60 FPS in any browser without plugins. |
| **MediaPipe Hands (Google)** | 21-Landmark Vision Tracking | `ARHandController.js`, `ARGestureRating.js` | Runs client-side in WebAssembly/WebGL. Super fast (30–60 FPS) with zero server latency or cloud API costs. |
| **Rapier3D** | Physics Simulation | `Physics.js`, `PhysicalVehicle.js` | Written in Rust and compiled to WebAssembly. Much faster and more deterministic than legacy Cannon.js or Ammo.js. |
| **TSL (Three Shading Language)** | Custom Shaders | `VisualVehicle.js`, `Materials/` | Next-gen shader pipeline that compiles seamlessly to both WebGPU and WebGL 2.0. |
| **Web Audio API & Howler** | Sound Design | `Audio.js`, `ARGestureRating.js` | Synthesizes interactive pitch-tuned audio tones and spatial 3D positional audio. |
| **Vite 7** | Build Tool & Dev Server | `vite.config.js`, `package.json` | Ultra-fast Hot Module Replacement (HMR) with built-in basic-ssl for secure HTTPS webcam access. |
| **GSAP** | Motion & Tweens | `ProjectsArea.js`, `CareerArea.js`, `View.js` | Smooth cinematic camera transitions, HUD animations, and UI easing. |

---

## 🏃 10. How to Run, Test, and Verify the Project

### 1. Prerequisites
Ensure [Node.js](https://nodejs.org) is installed on your computer.

### 2. Run the Development Server
- 📁 **Configuration:** [`vite.config.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/vite.config.js)
- 📁 **Dependencies & Scripts:** [`package.json`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/package.json)

Open your terminal inside the project directory:
```bash
cd "/Users/aditisharma/Downloads/sem 7/portfolio/folio-2025"

# Install dependencies (if not already installed)
npm install --force

# Launch secure development server
npm run dev
```

### 3. Open in Browser
- **On Your Computer:** Open `https://localhost:5173/` (or the port shown in terminal).  
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

Here are the exact questions professors love to ask during AR/VR project evaluations, along with the ideal academic answers and the exact code files to reference:

### Q1: *"How does this project prove both AR and VR?"*
> **Answer:**  
> *"It demonstrates both sides of Milgram's Reality-Virtuality Continuum:  
> 1. **Virtual Reality:** The 3D cyber plaza is a complete synthetic virtual environment with continuous 3D spatial agency, perspective projection, motion parallax, and Rapier3D rigid-body physics ([`sources/Game/World/`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/)).  
> 2. **Augmented Reality:** The camera viewport superimposes digital 3D holographic stars, energy arcs, deadzone rings, and directional vectors directly onto the user's physical body in real time based on 21-landmark optical tracking ([`sources/Game/ARGestureRating.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARGestureRating.js) & [`sources/Game/ARHandController.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARHandController.js))."*

### Q2: *"Is hand tracking just Computer Vision, or is it true Augmented Reality?"*
> **Answer:**  
> *"Computer Vision is the **input detection layer** (MediaPipe calculating the 21 coordinate points of the hand). Augmented Reality is the **spatial output layer**: anchoring synthetic 3D geometry (rotating holographic stars, electric energy arcs, cockpit HUDs) onto real-world coordinates in the live video stream (implemented in `ARGestureRating.drawHandAugmentations()`)."*

### Q3: *"How does controlling the 3D avatar with hand gestures qualify as AR/VR?"*
> **Answer:**  
> *"In spatial computing literature, this is classified as **Cross-Reality (XR) Teleoperation and Video See-Through (VST) Augmented Reality**. The physical webcam feed is augmented with dynamic 3D directional vectors, deadzone calibration rings, and telemetry overlays, directly bridging physical human kinematics into the synthetic 3D virtual environment ([`sources/Game/ARHandController.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARHandController.js) and [`sources/Game/Player.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Player.js))."*

### Q4: *"How do you prevent hand jitter from causing vehicle drift or false ratings?"*
> **Answer:**  
> *"Through a dual-filter architecture:  
> 1. **Radial Deadzone Filter:** In Hand Drive mode, an 8% circular neutral zone around screen center ignores natural hand tremor (`this.deadzoneRadius = 0.08` in `ARHandController.js`).  
> 2. **Temporal Dwell Accumulator:** In rating mode, the user must hold the finger gesture steady for 850 milliseconds before triggering submission, eliminating accidental flashes (`this.holdThreshold = 850` in `ARGestureRating.js`)."*

### Q5: *"Why did you use WebGL/Three.js instead of Unity or Unreal?"*
> **Answer:**  
> *"Web-based spatial computing provides **zero-friction universal accessibility**. Any user on any device can open a single URL and experience full 3D physics and computer vision without downloading multi-gigabyte apps or requiring proprietary hardware."*

---

## 📂 12. Complete Code Map & File Directory

```
folio-2025/
├── sources/
│   ├── index.html                           # Main 3D WebGL desktop entry point & HUD HTML
│   ├── index.js                             # Game initialization bootstrap (new Game())
│   ├── ar.html & ar.js                      # Dedicated mobile pass-through AR experience
│   ├── vr.html & vr.js                      # Dedicated WebXR & stereoscopic split-screen VR
│   │
│   ├── Game/
│   │   ├── Game.js                          # Master orchestrator connecting all modules
│   │   ├── Player.js                        # Player kinematics, input routing & AR bridge
│   │   ├── ARHandController.js              # 🖐️ AR Hand Drive & Cockpit Flight HUD
│   │   ├── ARGestureRating.js               # ⭐ 1-5 Finger Count AR Rating & 3D Stars
│   │   ├── QuickNav.js                      # Top arcade HUD navigation bar
│   │   ├── Audio.js                         # Web Audio API & Howler sound synthesizer
│   │   ├── View.js                          # Three.js camera, focus point, & speed lines
│   │   ├── Ligthing.js                      # Directional sunlight & ambient lighting
│   │   │
│   │   ├── Physics/
│   │   │   ├── Physics.js                   # Rapier3D WebAssembly physics engine
│   │   │   └── PhysicalVehicle.js           # Raycast suspension vehicle chassis
│   │   │
│   │   ├── World/
│   │   │   ├── World.js                     # World entity container
│   │   │   ├── VisualVehicle.js             # 3D Aditi avatar mesh, hair & walking logic
│   │   │   ├── DayCycles.js                 # Day/Night solar orbit simulation
│   │   │   ├── Weather.js                   # Weather simulation (rain, snow, clear)
│   │   │   │
│   │   │   └── Areas/
│   │   │       ├── LandingArea.js           # 3D "ADITI SHARMA" intro plaza
│   │   │       ├── ProjectsArea.js          # Interactive 3D Projects Blackboard
│   │   │       ├── CareerArea.js            # Elevating stone milestones track
│   │   │       ├── BowlingArea.js           # Rapier3D physics bowling alley
│   │   │       └── SocialArea.js            # Social links & statues area
│   │   │
│   │   └── Inputs/
│   │       ├── Inputs.js                    # Keyboard, mouse, & touch joystick inputs
│   │       └── Keyboard.js                  # WASD / Arrow keys input handler
│   │
│   ├── data/
│   │   ├── projects.js                      # Aditi's 7 real-world engineering projects
│   │   ├── achievements.js                  # Unlockable in-game achievements
│   │   └── countries.js                     # Geolocation country mappings
│   │
│   └── style/
│       ├── arHandController.styl            # Cockpit HUD & hand controller styles
│       ├── arGestureRating.styl             # Rating pill, modal & star animation styles
│       ├── arExperience.styl                # Mobile AR view styles
│       └── vrExperience.styl                # VR stereoscopic & gaze reticle styles
│
├── static/                                  # 3D models (.glb), textures, audio files (.mp3)
├── package.json                             # Dependencies (@dimforge/rapier3d, three, vite)
├── vite.config.js                           # Vite dev server with HTTPS basic-ssl
└── explanation.md                           # This complete documentation & viva guide
```

---

*This document contains everything you need to understand, locate code for, demonstrate, and defend this project with full confidence!*
