# 🌟 Project Explanation: 3D Spatial Computing Portfolio with Vision-Based AR & VR

> **Author:** Aditi Sharma  
> **Course:** Augmented Reality & Virtual Reality (AR/VR) — Semester 7  
> **Repository:** `folio-2025`  
> **Core Concepts:** Non-Immersive Desktop VR, Markerless Vision-Based AR, Natural User Interfaces (NUI), Cross-Reality (XR) Teleoperation, WebAssembly Physics.

---

## 🚀 1. The 30-Second "Elevator Pitch"

🗣️ **What to say to your professor:**
> *"Professor, this project is a complete Web-based Spatial Computing platform that brings together both **Virtual Reality (VR)** and **Augmented Reality (AR)** in a standard web browser with zero installation.*  
> *In the **VR mode**, the user explores an interactive 3D world with real physics, controlling a custom 3D avatar (Aditi) through engineering projects, career milestones, and games.*  
> *In the **AR mode**, the system uses the webcam and AI computer vision to track the user's hand in real time with 21 skeletal joints. This allows two features: first, you can **drive and steer the 3D character in virtual space using hand movements in front of your camera**; second, you can **rate the portfolio by holding up 1 to 5 fingers**, which renders 3D rotating holographic stars and electrical laser beams anchored directly onto your real fingertips!"*

---

## 🎯 2. What Problem Does This Solve? (The "Why")

Traditional developer portfolios are just flat, 2D scrolling pages with text and links.  
This project transforms a portfolio into an **interactive Spatial Computing application**:

1. **Practical Application of Course Theory:** It demonstrates the complete **Milgram Reality-Virtuality Continuum** (blending the real physical world with digital graphics and pure virtual worlds).
2. **Natural User Interface (NUI):** Instead of just typing on a keyboard or clicking a mouse, the user can interact naturally using hand gestures captured by standard webcams.
3. **Cross-Reality (XR) Interaction:** Physical human motions in the real room directly control dynamic physical forces inside a 3D virtual environment.
4. **Frictionless Web Delivery:** Runs on any modern browser (Chrome, Safari, Edge) on Mac, Windows, iOS, and Android without requiring app-store downloads, Unity plugins, or heavy installs.

---

## 🌐 3. The Big Picture: Milgram's Reality-Virtuality Continuum

A core theoretical concept in the AR/VR curriculum is **Paul Milgram's Reality-Virtuality Continuum**.  
Think of it as a spectrum from **100% Real World** to **100% Virtual World**:

```
[Real Physical World] <======================> [Augmented Reality (AR)] <======================> [Virtual Reality (VR)]
        │                                                 ▲                                                 ▲
   Webcam Feed                                  Live Video + Digital Stars                        100% Synthetic 3D World
(Your physical room)                            & Cockpit Steering HUD Vectors                  (Three.js + Rapier3D physics)
```

🗣️ **How to explain this to the professor:**
- **On the VR side (Virtual Reality):** The 3D world is 100% synthetically generated inside the computer using Three.js and the Rapier3D physics engine. There is no real-world video involved.  
  📁 *Performing Files:* [`sources/Game/World/`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/) & [`sources/Game/Physics/`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Physics/)
- **In the middle (Augmented Reality):** The webcam captures your real physical room, and the computer superimposes 3D digital elements (rotating golden stars, electric laser arcs, and navigation crosshairs) anchored directly to your physical hand.  
  📁 *Performing Files:* [`sources/Game/ARGestureRating.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARGestureRating.js) & [`sources/Game/ARHandController.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARHandController.js)
- **The Cross-Reality (XR) Bridge:** The physical motion of your hand in the real world is converted into mathematical force vectors that drive the character in the virtual world.  
  📁 *Performing File:* [`sources/Game/Player.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Player.js) (Lines 575–600)

---

## 🕹️ 4. The 3 Core Experiences & Their Performing Files

Here is a clear summary of the three main experiences and where the code lives:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     ADITI SHARMA'S PORTFOLIO                                     │
├──────────────────────────────┬──────────────────────────────────┬────────────────────────────────┤
│ 1. Desktop 3D World (VR)     │ 2. Vision AR Hand Teleop         │ 3. Vision AR Finger Rating     │
├──────────────────────────────┼──────────────────────────────────┼────────────────────────────────┤
│ • Full 3D Cyber Plaza        │ • Webcam Cockpit Flight HUD      │ • 1 to 5 extended fingers      │
│ • Custom Aditi Avatar        │ • Palm Center Tracking           │ • 3D Stars on each fingertip   │
│ • Rapier3D Physics Engine    │ • 8% Neutral Deadzone            │ • Electric laser energy arcs   │
│ • 7 Real Engineering Projects│ • Hand Up = Drive Forward        │ • 850ms Dwell Lock-in          │
│ • Elevating Career Track     │ • Hand Down = Reverse            │ • Celebratory Confetti & Audio │
│ • Knockable Bowling Alley    │ • Fist = Handbrake               │ • Modal Feedback Review        │
│ • Day/Night & Dynamic Weather│ • Open Palm = Nitro Boost        │                                │
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

- 📁 **Primary Controller File:** [`sources/Game/ARHandController.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARHandController.js) (`class ARHandController`)
- 📁 **Input & Physics Bridge:** [`sources/Game/Player.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Player.js) (Lines 575–600 in `updatePrePhysics()`)
- 📁 **Camera Tracking Logic:** [`sources/Game/View.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/View.js) (Lines 590–625 in focus point updates)
- 📁 **HUD Styling & Overlay:** [`sources/style/arHandController.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/arHandController.styl)

### How to use it:
Click the glowing cyan button in the bottom right corner: **`🖐️ AR Hand Drive`**.  
A Picture-in-Picture cockpit window opens in the bottom-left corner with your live webcam stream.

### How it works (In Plain English):

1. **Reading the Hand (21 Landmarks):**
   - In `ARHandController.initHands()`, we load Google MediaPipe Hands running locally in WebAssembly.
   - It identifies 21 specific points on your hand (wrist, knuckles, joints, fingertips) at 30 to 60 frames per second.
2. **Finding the Palm Center:**
   - In `ARHandController.processHand()`, instead of just tracking one finger, we take the average position of the 4 base knuckles and the wrist. This gives a steady, reliable center point for the hand.
3. **The 8% Deadzone (Like a Game Controller):**
   - *Analogy:* Just like a PlayStation or Xbox controller has a deadzone in the center so your character doesn't wander off when your thumb twitches, we create an 8% circular deadzone in the center of the camera.
   - While your hand is inside this neutral ring, the character stays still.
4. **Steering and Speed:**
   - **Hand Moved Up (above center):** The character accelerates forward. The higher you hold your hand, the faster it goes.
   - **Hand Moved Down (below center):** The character drives in reverse or brakes.
   - **Hand Moved Left or Right:** The character steers smoothly left or right.
5. **Special Gestures:**
   - **Open Palm 🖐️ (All 5 fingers spread wide):** Activates **Nitro Boost** with anime-style speed lines across the screen.
   - **Clenched Fist ✊ (Fingers closed):** Engages the **Emergency Handbrake**, stopping all movement instantly.
6. **Camera Lock & Fail-Safes:**
   - In `View.js`, the camera automatically tracks the avatar so you never lose sight of her while driving.
   - If you ever drive into an obstacle or off-road, the Cockpit HUD has two safety buttons:
     - **🎯 Locate:** Snaps the camera directly back to the character.
     - **🔄 Respawn:** Instantly teleports the character back to the central plaza.

🗣️ **How to explain this to the professor:**
> *"Here we are demonstrating **Cross-Reality Teleoperation**. The webcam detects my hand using 21 skeletal landmarks. When I raise my hand above the central deadzone, the system calculates a 3D directional vector that applies forward engine force to the character in the virtual world. If I spread all five fingers, it detects an open palm and triggers nitro boost; if I make a fist, it brakes. The camera automatically tracks the avatar so the user maintains visual feedback at all times."*

---

## ⭐ 6. Deep Dive: AR Feature 2 — Dynamic Finger-Count Rating

- 📁 **Primary Rating File:** [`sources/Game/ARGestureRating.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARGestureRating.js) (`class ARGestureRating`)
- 📁 **Styling & Particle CSS:** [`sources/style/arGestureRating.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/arGestureRating.styl)
- 📁 **Instantiated in:** [`sources/Game/Game.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Game.js) (Line 206)

### How to use it:
Click the magenta button in the bottom right corner: **`✌️ Rate with Gestures`** or **`🖐️ Rate with Fingers (1–5 ⭐)`**.  
Hold up 1, 2, 3, 4, or 5 fingers in front of your camera!

### How it works (In Plain English):

1. **How the Computer Knows Which Fingers Are Extended:**
   - Handled in `ARGestureRating.countExtendedFingers()`:
   - For the index, middle, ring, and pinky fingers, the code compares the distance between the fingertip and the wrist against the distance between the middle joint and the wrist. If the tip is farther and higher than the knuckle, that finger is counted as **extended**.
   - For the thumb, it measures how far outward it is pointing compared to the base of the pinky.
2. **Counting Fingers to Stars:**
   - The number of extended fingers directly sets the rating in real time:
     - 1 Finger = 1 Star ⭐
     - 2 Fingers = 2 Stars ⭐⭐ (Victory / Peace sign!)
     - 3 Fingers = 3 Stars ⭐⭐⭐
     - 4 Fingers = 4 Stars ⭐⭐⭐⭐
     - 5 Fingers = 5 Stars ⭐⭐⭐⭐⭐ (Full open hand)
3. **The AR Element (Anchoring Digital Objects to the Real World):**
   - Handled in `ARGestureRating.drawHandAugmentations()`:
   - **3D Rotating Holographic Stars:** A golden, spinning 3D star is drawn directly over **every active fingertip** on the video feed.
   - **Electric Laser Arc:** An animated glowing beam connects all open fingertips together.
   - **Floating HUD Badge:** A cybernetic rating tag floats directly above your hand in 3D camera space.
4. **The 850-Millisecond Dwell Timer (Preventing False Triggers):**
   - Handled via `this.holdTimer` in `ARGestureRating.update()`:
   - If someone briefly flashes a hand, it won't submit by accident. The user must hold their rating steady for **850 ms** to confirm their intent.
   - Once confirmed, celebratory 3D confetti bursts on the screen, a musical chord plays, and an interactive review modal opens with pre-selected positive feedback tags.

🗣️ **How to explain this to the professor:**
> *"This is a classic **Video See-Through Augmented Reality** feature. The system counts how many fingers are extended in front of the camera and maps them to a 1-to-5 star rating. What makes this true AR—and not just computer vision—is that we are anchoring digital 3D objects (rotating golden stars and electrical arcs) directly onto the physical fingertips in the live video stream. We use an 850ms dwell timer to ensure intentional submission."*

---

## 🏛️ 7. Deep Dive: The 3D Virtual Reality World & Areas

- 📁 **Master Engine Orchestrator:** [`sources/Game/Game.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Game.js)
- 📁 **HTML Entry Point:** [`sources/index.html`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/index.html)
- 📁 **JS Bootstrap:** [`sources/index.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/index.js)

When the webpage loads, you enter a living 3D synthetic universe:

### 1. The Avatar (Aditi Sharma)
- 📁 **Visual Mesh & Geometry:** [`sources/Game/World/VisualVehicle.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/VisualVehicle.js) (Method: `createCharacter()`)
- 📁 **Kinematics & Movement:** [`sources/Game/Player.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Player.js)
- Rather than a plain car or generic cube, the user controls a custom 3D stylized character representing Aditi Sharma.
- Features expressive facial modeling, natural skin tones, dark amber eyes, stylish clothing, boots, and flowing espresso brunette hair.
- Includes procedural walk cycle animations, natural breathing idle motions, and lean angles when turning.

### 2. Rapier3D Physics Engine (WebAssembly)
- 📁 **Physics Engine Core:** [`sources/Game/Physics/Physics.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Physics/Physics.js)
- 📁 **Vehicle Raycast Suspension:** [`sources/Game/Physics/PhysicalVehicle.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Physics/PhysicalVehicle.js)
- 📁 **Dependency:** `@dimforge/rapier3d` in [`package.json`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/package.json)
- The movement isn't fake or hardcoded; it uses a real physics engine written in Rust and compiled to WebAssembly.
- 4 downward raycasts act as wheels and suspension springs. It simulates inertia, drifting, acceleration, and real collisions.

### 3. Key Zones in the Cyber Plaza:

#### A. Landing Area (Entrance Plaza)
- 📁 **Source File:** [`sources/Game/World/Areas/LandingArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/LandingArea.js)
- Features giant 3D chrome metallic letters spelling **`ADITI SHARMA`** in the center of the world.
- Serves as the starting hub with interactive audio.

#### B. Projects Billboard Area
- 📁 **Source File:** [`sources/Game/World/Areas/ProjectsArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/ProjectsArea.js)
- 📁 **Data File:** [`sources/data/projects.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/data/projects.js)
- A massive 3D electronic screen that renders project details, technical stacks, and GitHub links directly in the 3D scene:
  1. *Autonomous Clinical Trial Analyst* (Agentic AI with LangGraph, FastAPI, Qdrant)
  2. *Enterprise Cloud Operations Platform* (HCLTech Azure & Kubernetes multi-agent triage)
  3. *Ground Control Visualization Platform* (ISRO CanSat & suborbital rocket telemetry)
  4. *FraudNet Guardian* (FinTech credit card fraud ML with XGBoost & SHAP)
  5. *ZoneLock AI Road Guardian* (Edge AI Computer Vision with YOLOv8 & DeepSORT)
  6. *Risk Scoring & Prioritization Platform* (Predictive ML decision engine)
  7. *Customer Retention Analytics* (Olist 100k+ order RFM segmentation & CLV)

#### C. Career Milestones Track
- 📁 **Source File:** [`sources/Game/World/Areas/CareerArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/CareerArea.js)
- Six stone slabs that physically rise out of the ground when the character walks near them, highlighting:
  - *VIT Vellore:* Integrated M.Tech CSE, 9.65 CGPA (Rank 3)
  - *St. Joseph's Convent:* 95.4% School Topper
  - *NDA 149 Merit List:* AIR 417 (Girls Rank 53)
  - *HCLTech:* Software & AI Intern (Azure & LangGraph)
  - *Team Sammard (Rocketry):* CS Senior Core Lead & ISRO CanSat
  - *VIT Student Council:* Member Secretary

#### D. Arcade Bowling Alley
- 📁 **Source File:** [`sources/Game/World/Areas/BowlingArea.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Areas/BowlingArea.js)
- A physical bowling lane with 10 rigid-body pins. Driving into them uses momentum transfer to knock them down with sound effects and strike notifications.

#### E. Atmospheric & Audio Systems
- 📁 **Audio Synthesizer:** [`sources/Game/Audio.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Audio.js) (Web Audio API & Howler)
- 📁 **Lighting & Sun Cycles:** [`sources/Game/World/DayCycles.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/DayCycles.js) & [`sources/Game/Ligthing.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/Ligthing.js)
- 📁 **Weather Effects:** [`sources/Game/World/Weather.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/Weather.js) (Simulates rain, snow, blowing leaves, and wind)

#### F. Quick Navigation Arcade HUD
- 📁 **Source File:** [`sources/Game/QuickNav.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/QuickNav.js)
- An arcade-style navigation bar at the top of the screen that lets the user instantly teleport to Projects, Career, Bowling, and other areas.

---

## 📱 8. Dedicated Mobile AR & WebXR VR Modes

In addition to desktop webcam interaction, the project includes dedicated mobile experiences:

### 1. Dedicated Mobile Pass-Through AR
- 📁 **HTML Template:** [`sources/ar.html`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/ar.html)
- 📁 **Logic & Sensors:** [`sources/ar.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/ar.js)
- 📁 **Styling:** [`sources/style/arExperience.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/arExperience.styl)
- **What it does:**
  - Designed for smartphones (iPhone or Android) using the rear camera.
  - Places the 3D car, avatar, and project orbs directly on your physical floor or table (similar to Pokemon GO).
  - Uses the phone's internal gyroscope and motion sensors to track orientation in 360 degrees.
  - Supports Apple QuickLook USDZ files for native iOS AR.

### 2. Dedicated Stereoscopic & WebXR VR
- 📁 **HTML Template:** [`sources/vr.html`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/vr.html)
- 📁 **Logic & Gaze Tracking:** [`sources/vr.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/vr.js)
- 📁 **Styling:** [`sources/style/vrExperience.styl`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/style/vrExperience.styl)
- **What it does:**
  - **Stereoscopic Split-Screen Mode:** Splits the screen into left-eye and right-eye views for Google Cardboard or mobile VR phone headsets.
  - **WebXR Mode:** Connects natively to Meta Quest 2/3 and Apple Vision Pro.
  - **Hands-Free Gaze Reticle:** You don't need a controller. Looking at an object for 1.5 seconds automatically activates it.

### 3. Wi-Fi QR Code Launcher
- 📁 **Source File:** [`sources/Game/AR.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/AR.js)
- Automatically displays a QR code with your local Wi-Fi IP address so you can scan it with your phone and immediately launch the mobile AR/VR modes.

---

## 🛠️ 9. Technology Stack & Why Each Tool Was Chosen

| Technology | Role | Where Used in Code | Why It Was Chosen (Simple Explanation) |
| :--- | :--- | :--- | :--- |
| **Three.js (r183+)** | 3D Graphics Engine | All files in `sources/Game/` | Runs smooth 60 FPS 3D graphics in any web browser without needing any plugins. |
| **Google MediaPipe Hands** | Hand Landmark Tracking | `ARHandController.js`, `ARGestureRating.js` | Runs client-side in WebAssembly. Extremely fast (30–60 FPS) with zero server latency or cloud costs. |
| **Rapier3D** | Physics Simulation | `Physics.js`, `PhysicalVehicle.js` | Written in Rust and compiled to WebAssembly. Much faster and more stable than older JavaScript physics engines. |
| **TSL (Three Shading Language)** | Custom Visual Shaders | `VisualVehicle.js`, `Materials/` | Next-generation shader language that works across both WebGPU and WebGL 2.0. |
| **Web Audio API & Howler** | Sound Synthesizer | `Audio.js`, `ARGestureRating.js` | Plays positional 3D sound effects and synthesizes musical chords when you rate the site. |
| **Vite 7** | Build & Dev Server | `vite.config.js`, `package.json` | Instant hot reloading with built-in HTTPS SSL certificates (required by browsers for webcam access). |
| **GSAP** | Animation Tweens | `ProjectsArea.js`, `CareerArea.js`, `View.js` | Industry-standard library for smooth camera transitions and UI animations. |

---

## 🏃 10. How to Run, Test, and Verify the Project

### 1. Prerequisites
Make sure [Node.js](https://nodejs.org) is installed on your computer.

### 2. Run the Development Server
- 📁 **Configuration:** [`vite.config.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/vite.config.js)
- 📁 **Dependencies & Scripts:** [`package.json`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/package.json)

Open your terminal inside the project folder:
```bash
cd "/Users/aditisharma/Downloads/sem 7/portfolio/folio-2025"

# Install packages
npm install --force

# Start secure local server
npm run dev
```

### 3. Open in Browser
- **On Your Computer:** Open `https://localhost:5173/` (or the port shown in your terminal).  
  *(Accept the local self-signed SSL certificate so your browser allows webcam access).*
- **On Your Phone (Same Wi-Fi):**  
  Open the network IP shown in the terminal (e.g., `https://192.168.x.x:5173/ar.html`).

### 4. Check Git Status
```bash
git status
git log --oneline -5
```

---

## 🎓 11. Professor Viva & Presentation Q&A Cheat Sheet

Here are the 5 most common questions professors ask, written in simple, clear language that you can speak with confidence:

### Q1: *"How does this project demonstrate both AR and VR?"*
> **Answer:**  
> *"It demonstrates both ends of Milgram's Reality-Virtuality Continuum:  
> 1. **VR:** The 3D world is 100% synthetically created with Three.js and Rapier3D physics. The user has full spatial freedom to navigate around the plaza in 3D Cartesian coordinates ([`sources/Game/World/`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/World/)).  
> 2. **AR:** The system captures the user's physical room through the webcam and superimposes digital 3D objects (rotating golden stars, electric arcs, and navigation vectors) directly anchored to the user's physical fingertips and palm ([`sources/Game/ARGestureRating.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARGestureRating.js))."*

### Q2: *"Is hand tracking just Computer Vision, or is it true Augmented Reality?"*
> **Answer:**  
> *"Computer Vision is only the **input step** (MediaPipe calculating the 21 coordinate points of the hand). Augmented Reality is the **spatial visualization step**: anchoring computer-generated 3D geometry (spinning holographic stars and laser arcs) onto real-world body coordinates inside the live camera feed."*

### Q3: *"How does controlling the 3D character with hand gestures qualify under AR/VR?"*
> **Answer:**  
> *"In spatial computing literature, this is called **Cross-Reality (XR) Teleoperation**. The webcam feed is augmented with dynamic 3D directional vectors, deadzone rings, and telemetry overlays. Moving the physical hand creates mathematical kinematic vectors that directly drive the physics engine in the virtual world ([`sources/Game/ARHandController.js`](file:///Users/aditisharma/Downloads/sem%207/portfolio/folio-2025/sources/Game/ARHandController.js))."*

### Q4: *"How do you prevent natural hand tremor from causing unintended movement or false ratings?"*
> **Answer:**  
> *"We use two specific filtering mechanisms:  
> 1. **Radial Deadzone Filter:** In Hand Drive mode, an 8% neutral circle in the center of the screen ignores resting hand jitter (`this.deadzoneRadius = 0.08` in `ARHandController.js`).  
> 2. **Temporal Dwell Accumulator:** In rating mode, the user must hold their finger gesture steady for 850 milliseconds before it registers (`this.holdThreshold = 850` in `ARGestureRating.js`)."*

### Q5: *"Why did you build this in WebGL/Three.js instead of Unity or Unreal?"*
> **Answer:**  
> *"Web-based spatial computing provides **frictionless universal access**. Anyone on any computer or phone can simply click a link and experience full 3D graphics, physics, and computer vision without downloading multi-gigabyte apps or special software."*

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
