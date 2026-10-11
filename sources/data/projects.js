export default [
    {
        title: 'Autonomous Clinical Trial Analyst',
        titleSmall: [ 'Clinical Trial', 'Analyst' ],
        category: '🤖 Agentic AI & Healthcare',
        tagline: 'Autonomous Multi-Agent RAG System for Clinical Trial Protocol Synthesis',
        description: 'An intelligent multi-agent AI system built using LangGraph, FastAPI, and Qdrant vector database. It automates literature review across PubMed and ClinicalTrials.gov, extracts complex eligibility criteria, identifies trial design risks, and produces evidence-grounded reports in minutes.',
        problemSolved: 'Clinical trial protocols typically take weeks of manual analysis across thousands of research papers. This platform accelerates synthesis by over 80% with full audit trails.',
        keyFeatures: [
            'Multi-Agent Workflow (Retriever, Analyst, Reviewer, and Validator agents)',
            'Biomedical semantic search with Qdrant vector database and hybrid BM25 re-ranking',
            'Structured JSON extraction of inclusion/exclusion criteria & FDA compliance flags',
            'High-throughput async REST API with FastAPI & real-time streaming analysis'
        ],
        techStack: [ 'LangGraph', 'FastAPI', 'Qdrant', 'Python', 'OpenAI / Gemini', 'Docker' ],
        url: 'https://github.com/jiya2000/Autonomous-Clinical-Trial-Analyst',
        attributes:
        {
            role: [ 'AI Engineer', 'RAG Specialist' ],
            at: 'Agentic RAG System',
            with: [ 'LangGraph', 'FastAPI', 'Qdrant' ]
        },
        distinctions: [ 'fwa' ],
        images:
        [
            'threejs-journey-1.ktx',
            'threejs-journey-2.ktx',
            'threejs-journey-3.ktx'
        ]
    },
    {
        title: 'Enterprise Cloud Operations Platform',
        titleSmall: [ 'Cloud Ops', 'Multi-Agent' ],
        category: '☁️ Enterprise Cloud & DevOps',
        tagline: 'Multi-Agent Autonomous Incident Diagnosis & Remediation Platform',
        description: 'Enterprise AI operations framework engineered during my internship at HCLTech. Deploys autonomous agents to monitor Kubernetes clusters, analyze telemetry and log streams, diagnose root causes, and execute automated remediations across Azure environments.',
        problemSolved: 'Eliminates manual firefighting during cloud service outages by shrinking Mean Time to Resolution (MTTR) with proactive anomaly triage.',
        keyFeatures: [
            'Autonomous multi-agent orchestration for cloud incident triage and root cause analysis',
            'Real-time Kubernetes metric & log ingestion via Azure Monitor APIs',
            'Self-healing action runner with human-in-the-loop safety approval controls',
            'Interactive operational dashboards with automated post-mortem generation'
        ],
        techStack: [ 'Azure', 'Kubernetes', 'LangGraph', 'Python', 'FastAPI', 'Prometheus' ],
        url: 'https://github.com/jiya2000/AI-powered-Cloud-OPeration',
        attributes:
        {
            role: [ 'Software & AI Intern' ],
            at: 'HCLTech Enterprise',
            with: [ 'LangGraph', 'Azure', 'Kubernetes' ]
        },
        distinctions: [ 'awwwards' ],
        images:
        [
            'bonhomme-10-ans-1.ktx',
            'bonhomme-10-ans-2.ktx',
            'bonhomme-10-ans-3.ktx'
        ]
    },
    {
        title: 'Ground Control Visualization Platform',
        titleSmall: [ 'Ground Control', 'Telemetry' ],
        category: '🚀 Aerospace & Rocket Telemetry',
        tagline: 'Real-Time Flight Telemetry & Suborbital Trajectory Ground Station',
        description: 'Mission-critical ground station software developed as Senior Core Lead for Team Sammard (Rocketry). Streams high-frequency sensor telemetry (altitude, GPS, acceleration, roll/pitch/yaw) from suborbital rockets via RF transceivers, rendering real-time 3D flight trajectories and emergency abort telemetry.',
        problemSolved: 'High-speed suborbital launches require sub-second telemetry visualization and fail-safe sensor health checks under harsh RF noise.',
        keyFeatures: [
            'High-frequency serial / RF radio packet decoding with CRC error checking',
            'Real-time 3D rocket orientation & flight trajectory visualization',
            'Critical alert thresholds for apogee detection & dual parachute deployment',
            'Comprehensive flight log replay and post-mission aerodynamics analysis'
        ],
        techStack: [ 'Python', 'PyQt5', 'Telemetry / RF', 'Sensors / IMU', 'Real-Time Systems' ],
        url: 'https://github.com/jiya2000',
        attributes:
        {
            role: [ 'CS Senior Core Lead' ],
            at: 'Team Sammard (Rocketry)',
            with: [ 'Python', 'PyQt5', 'Telemetry' ]
        },
        distinctions: [ 'fwa' ],
        images:
        [
            'citrix-redbull-1.ktx',
            'citrix-redbull-2.ktx',
            'citrix-redbull-3.ktx'
        ]
    },
    {
        title: 'FraudNet Guardian',
        titleSmall: [ 'FraudNet', 'Guardian' ],
        category: '🛡️ FinTech & Cybersecurity',
        tagline: 'Deep Learning Financial Fraud Detection & Transaction Risk Engine',
        description: 'Full-stack fraud detection system combining supervised machine learning and graph anomaly detection to identify fraudulent banking transactions in real-time. Employs cost-sensitive classifiers to handle severe class imbalance.',
        problemSolved: 'Prevents millions in financial loss by flagging high-risk fraudulent card transactions in milliseconds before authorizations settle.',
        keyFeatures: [
            'Robust handling of highly skewed fraud distributions with SMOTE and focal loss',
            'Real-time transaction scoring engine with millisecond API response time',
            'Feature attribution with SHAP explainability for compliance auditability',
            'Interactive risk alert dashboard with merchant geolocation risk flags'
        ],
        techStack: [ 'Python', 'XGBoost', 'Scikit-Learn', 'FastAPI', 'React', 'Docker' ],
        url: 'https://github.com/jiya2000/FraudNet-Guardian',
        attributes:
        {
            role: [ 'Full Stack & ML Dev' ],
            at: 'FinTech Security',
            with: [ 'Machine Learning', 'Python', 'JavaScript' ]
        },
        distinctions: [  ],
        images:
        [
            'madbox-1.ktx',
            'madbox-2.ktx',
            'madbox-3.ktx'
        ]
    },
    {
        title: 'ZoneLock AI Road Guardian',
        titleSmall: [ 'ZoneLock', 'Road Guardian' ],
        category: '🚗 Computer Vision & Smart Cities',
        tagline: 'Edge AI Vision for Geo-Fenced Traffic Safety & Helmet/Plate Detection',
        description: 'Computer vision-powered road safety intelligence platform. Uses fine-tuned YOLO and deep learning models to detect traffic violations, helmetless two-wheeler riders, unauthorized zone intrusions, and speed anomalies across CCTV camera feeds.',
        problemSolved: 'Automates traffic surveillance and geo-fenced safety enforcement in smart cities, reducing human monitoring overhead.',
        keyFeatures: [
            'Real-time object detection and multi-object tracking (DeepSORT) on video feeds',
            'Automatic helmet compliance detection and license plate bounding',
            'Virtual polygon geo-fencing for restricted zone intrusion detection',
            'Instant incident logging with snapshot evidence generation'
        ],
        techStack: [ 'Python', 'OpenCV', 'YOLOv8', 'PyTorch', 'DeepSORT', 'Flask' ],
        url: 'https://github.com/jiya2000/ZoneLock-AI-Road-Guardian',
        attributes:
        {
            role: [ 'Computer Vision & AI' ],
            at: 'Smart Mobility',
            with: [ 'Python', 'OpenCV', 'Deep Learning' ]
        },
        distinctions: [  ],
        images:
        [
            'luni-1.ktx',
            'luni-2.ktx',
            'luni-3.ktx'
        ]
    },
    {
        title: 'Risk Scoring & Prioritization Platform',
        titleSmall: [ 'Risk Scoring', 'Prioritization' ],
        category: '📊 Decision Science & Predictive ML',
        tagline: 'Multi-Criteria Predictive Risk Assessment Engine for Enterprise Workflows',
        description: 'Machine learning decision support framework that scores, segments, and prioritizes operational risks across business units. Integrates statistical modeling, feature importance ranking, and automated action prioritization pipelines.',
        problemSolved: 'Helps management focus on high-impact vulnerabilities first rather than drowning in unsorted ticket backlogs.',
        keyFeatures: [
            'Multi-criteria weighted risk scoring matrix with ensemble predictive models',
            'Automated priority tiering (Critical, High, Medium, Low) with threshold tuning',
            'Explainable AI predictions using SHAP values for business stakeholders',
            'Clean REST endpoints for integrating into existing enterprise CRM/ERP tools'
        ],
        techStack: [ 'Scikit-Learn', 'FastAPI', 'Pandas', 'NumPy', 'Seaborn' ],
        url: 'https://github.com/jiya2000/Risk-Scoring-Prioritization',
        attributes:
        {
            role: [ 'Data Scientist' ],
            at: 'Decision Support',
            with: [ 'Scikit-learn', 'FastAPI', 'Pandas' ]
        },
        distinctions: [  ],
        images:
        [
            'prior-1.ktx',
            'prior-2.ktx',
            'prior-3.ktx'
        ]
    },
    {
        title: 'Customer Retention Analytics & Churn Engine',
        titleSmall: [ 'Customer', 'Retention' ],
        category: '📈 E-Commerce Intelligence & Data Science',
        tagline: 'Advanced RFM Segmentation & Customer Lifetime Value (CLV) Analytics',
        description: 'End-to-end data science and customer analytics project built on the Brazilian Olist E-Commerce dataset (100k+ orders). Delivers customer segmentation via RFM modeling, churn prediction classifiers, and actionable retention strategies.',
        problemSolved: 'E-commerce retailers often lose 20-30% of customers to churn; this system identifies at-risk cohorts weeks before they disengage.',
        keyFeatures: [
            'Unsupervised customer segmentation using K-Means clustering and RFM metrics',
            'Predictive customer churn modeling with ensemble classifiers (88%+ ROC-AUC)',
            'Lifetime value (CLV) forecasting and cohort retention heatmaps',
            'Executive data story dashboard highlighting high-value repeat buyers'
        ],
        techStack: [ 'Python', 'Scikit-Learn', 'Pandas', 'K-Means', 'Plotly', 'Seaborn' ],
        url: 'https://github.com/jiya2000/customer-retention-insights-olist',
        attributes:
        {
            role: [ 'Data & ML Engineer' ],
            at: 'Olist E-Commerce',
            with: [ 'RFM Analysis', 'Predictive Modeling' ]
        },
        distinctions: [  ],
        images:
        [
            'orano-1.ktx',
            'orano-2.ktx',
            'orano-3.ktx'
        ]
    },
    {
        title: 'PowerBI Databricks IoT Platform',
        titleSmall: [ 'Databricks', 'IoT Platform' ],
        category: '⚡ Big Data & Lakehouse Architecture',
        tagline: 'Scalable IoT Stream Processing & Real-Time Executive Dashboard',
        description: 'Modern lakehouse data pipeline integrating Apache Spark on Databricks with PowerBI for industrial IoT sensor telemetry. Ingests simulated high-volume device telemetry, structures it into Delta Lake bronze/silver/gold layers, and serves real-time PowerBI KPIs.',
        problemSolved: 'Processes massive streams of industrial sensor telemetry reliably without data loss, turning raw signals into executive metrics.',
        keyFeatures: [
            'Medallion Lakehouse architecture (Bronze raw, Silver curated, Gold aggregated)',
            'PySpark distributed data transformations for high-throughput stream ingestion',
            'Delta Lake ACID transaction guarantees and time-travel query support',
            'Interactive PowerBI dashboards with drill-downs on device health & anomalies'
        ],
        techStack: [ 'Databricks', 'PySpark', 'Delta Lake', 'PowerBI', 'Azure Blob Storage' ],
        url: 'https://github.com/jiya2000/powerbi-databricks-iot',
        attributes:
        {
            role: [ 'Data Engineer' ],
            at: 'Lakehouse Architecture',
            with: [ 'Databricks', 'PySpark', 'PowerBI' ]
        },
        distinctions: [  ],
        images:
        [
            'scout-1.ktx',
            'scout-2.ktx',
            'scout-3.ktx'
        ]
    },
    {
        title: 'InvoChain Smart Invoicing Platform',
        titleSmall: [ 'InvoChain', 'Blockchain' ],
        category: '⛓️ Blockchain & Web3 FinTech',
        tagline: 'Decentralized Immutable Invoice Factoring & Settlement Protocol',
        description: 'Decentralized application (dApp) built on Ethereum/Polygon smart contracts to eradicate invoice fraud, duplicate financing, and late payment reconciliation. Invoices are minted as verifiable on-chain assets with automated escrow settlement.',
        problemSolved: 'Traditional supply chain invoicing suffers from duplicate factoring fraud and delayed payment dispute settlements.',
        keyFeatures: [
            'Solidity smart contracts for tamper-proof invoice creation & verification',
            'Escrow-based milestone payment automation upon delivery confirmation',
            'Web3 wallet integration (MetaMask) with client-side cryptography',
            'Decentralized document hash storage on IPFS for immutable audit trails'
        ],
        techStack: [ 'Solidity', 'Web3.js', 'Ethereum / Polygon', 'IPFS', 'JavaScript' ],
        url: 'https://github.com/jiya2000/INVOCHAIN',
        attributes:
        {
            role: [ 'Blockchain Developer' ],
            at: 'Decentralized Ledger',
            with: [ 'Smart Contracts', 'Web3', 'JavaScript' ]
        },
        distinctions: [  ],
        images:
        [
            'threejs-journey-4.ktx',
            'threejs-journey-5.ktx'
        ]
    },
    {
        title: 'Moodify Adaptive Audio Intelligence',
        titleSmall: [ 'Moodify', 'Music AI' ],
        category: '🎵 Audio AI & Recommendation Engines',
        tagline: 'Emotion-Aware Music Discovery & Facial Expression Mood Recommender',
        description: 'Intelligent audio recommendation system that detects the user\'s emotional state via real-time facial expression analysis and physiological mood inputs, algorithmically curating personalized music tracks to match or elevate their mood.',
        problemSolved: 'Removes the friction of searching for music by automatically adapting playlists to the listener\'s instantaneous psychological state.',
        keyFeatures: [
            'Real-time facial emotion recognition using deep convolutional neural networks',
            'Audio feature extraction (tempo, valence, energy, danceability, acousticness)',
            'Content-based and collaborative filtering recommendation engine',
            'Seamless music player interface with dynamic emotional mood transitions'
        ],
        techStack: [ 'Python', 'Deep Learning', 'OpenCV', 'Spotify API', 'Flask', 'JavaScript' ],
        url: 'https://github.com/jiya2000/moodify',
        attributes:
        {
            role: [ 'Full Stack AI Developer' ],
            at: 'Audio Intelligence',
            with: [ 'Python', 'Recommendation Engine' ]
        },
        distinctions: [  ],
        images:
        [
            'chartogne-taillet-1.ktx',
            'chartogne-taillet-2.ktx'
        ]
    },
    {
        title: 'AR/VR Spatial Experience',
        titleSmall: [ 'AR / VR', 'Experience' ],
        category: '🥽 Spatial Computing & Immersive WebXR',
        tagline: 'Interactive WebXR 3D Environment with Spatial Audio & Gesture Interaction',
        description: 'Cutting-edge WebXR spatial computing project designed for modern VR/AR headsets (Meta Quest, Apple Vision Pro) and interactive desktop browsers. Features procedural 3D environments, spatial audio, and hand-tracking interactions.',
        problemSolved: 'Brings desktop and VR users together into lightweight, accessible, zero-install 3D spatial web experiences.',
        keyFeatures: [
            'WebXR device API integration supporting VR headsets and mobile AR passthrough',
            'Custom 3D shaders, dynamic environmental lighting, and spatialized 3D audio',
            'Intuitive 6-DoF controller and hand gesture physics interactions',
            'Optimized 90+ FPS rendering pipeline across mobile and standalone hardware'
        ],
        techStack: [ 'Three.js', 'WebXR', 'GLSL Shaders', 'JavaScript', 'HTML5 WebGL' ],
        url: 'https://github.com/jiya2000/arvr',
        attributes:
        {
            role: [ 'Creative Developer' ],
            at: 'Spatial Computing',
            with: [ 'Three.js', 'WebXR', 'JavaScript' ]
        },
        distinctions: [  ],
        images:
        [
            'chartogne-taillet-3.ktx',
            'bonhomme-10-ans-4.ktx'
        ]
    },
    {
        title: 'Enterprise Asset Tracking & Management',
        titleSmall: [ 'Asset', 'Management' ],
        category: '🏢 Enterprise Systems & Resource Management',
        tagline: 'Full Lifecycle Enterprise Hardware & Software Asset Management System',
        description: 'Enterprise-grade asset management system engineered to track, allocate, and audit corporate hardware, software licenses, maintenance schedules, and departmental inventory with role-based access control (RBAC).',
        problemSolved: 'Eliminates lost hardware, unmanaged license renewals, and compliance audits by providing a unified central registry.',
        keyFeatures: [
            'Complete asset lifecycle management from procurement through depreciation',
            'Automated QR/Barcode generation for physical hardware tagging and audits',
            'Role-based access control (Admin, Manager, Employee) with security logging',
            'RESTful API backend with robust relational database schema and analytics'
        ],
        techStack: [ 'Python', 'FastAPI', 'PostgreSQL', 'REST API', 'JavaScript' ],
        url: 'https://github.com/jiya2000/Asset',
        attributes:
        {
            role: [ 'Backend Developer' ],
            at: 'Open Source',
            with: [ 'Python', 'Data Storage' ]
        },
        distinctions: [  ],
        images:
        [
            'luni-4.ktx',
            'madbox-3.ktx'
        ]
    },
    {
        title: 'Aditi Sharma 3D Interactive Portfolio',
        titleSmall: [ 'Aditi Sharma', 'Portfolio' ],
        category: '✨ 3D WebGPU Experience & Creative Tech',
        tagline: 'Gamified Interactive 3D Portfolio Built with Three.js & Modern WebGPU',
        description: 'The exact gamified portfolio you are exploring right now! Built with Three.js, WebGPU, Rapier physics, and custom TSL shaders. Replaces static resumes with an interactive open world where visitors explore real projects, technical skills, and achievements.',
        problemSolved: 'Transforms traditional static resumes into an unforgettable, high-tech interactive showcase demonstrating engineering excellence.',
        keyFeatures: [
            'Modern WebGPU pipeline with dynamic day/night cycles, shadows, and fog',
            'Rapier.js rigid body physics simulation with vehicle & character locomotion',
            'Smooth GSAP cinematic cameras, spatial sound effects, and responsive navigation',
            'Zero dependencies on heavy UI frameworks — lightweight, blazingly fast Vanilla JS'
        ],
        techStack: [ 'Three.js', 'WebGPU', 'Rapier Physics', 'Vite', 'Vanilla JS', 'GSAP' ],
        url: 'https://github.com/jiya2000/portfolio',
        attributes:
        {
            role: [ 'Full Stack / 3D Developer' ],
            at: 'Personal Portfolio',
            with: [ 'Three.js', 'WebGPU', 'Vite' ]
        },
        distinctions: [ 'fwa' ],
        images:
        [
            'threejs-journey-1.ktx',
            'threejs-journey-2.ktx'
        ]
    }
]