import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class FileReader {
    readAsArrayBuffer(blob) {
        blob.arrayBuffer().then(buf => {
            this.result = buf;
            if (this.onload) this.onload({ target: this });
            if (this.onloadend) this.onloadend({ target: this });
        });
    }
    readAsDataURL(blob) {
        blob.arrayBuffer().then(buf => {
            this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(buf).toString('base64')}`;
            if (this.onload) this.onload({ target: this });
            if (this.onloadend) this.onloadend({ target: this });
        });
    }
}
if (!globalThis.FileReader) {
    globalThis.FileReader = FileReader;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildAditiCharacter() {
    const girl = new THREE.Group();
    girl.name = 'AditiSharmaAvatar';

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0bc, roughness: 0.6, metalness: 0.0 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x221714, roughness: 0.5, metalness: 0.05 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x141620, roughness: 0.7, metalness: 0.05 });
    const jacketTrimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7, metalness: 0.0 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e2230, roughness: 0.8, metalness: 0.0 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.1 });
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.9 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.0 });
    const shoeAccentMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4, metalness: 0.0 });
    const lipMat = new THREE.MeshStandardMaterial({ color: 0xe17075, roughness: 0.4, metalness: 0.0 });
    const blushMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8, transparent: true, opacity: 0.55 });
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.0 });
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x3b2219, roughness: 0.2, metalness: 0.0 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.2, metalness: 0.0 });
    const browMat = new THREE.MeshStandardMaterial({ color: 0x1e120f, roughness: 0.8, metalness: 0.0 });
    const headphoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.25, metalness: 0.85 });
    const headphonePadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.1 });

    // Pedestal display ring
    const pedestalGeo = new THREE.CylinderGeometry(0.55, 0.60, 0.04, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x221320, roughness: 0.4, metalness: 0.3 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.02;
    girl.add(pedestal);

    const ringGeo = new THREE.TorusGeometry(0.58, 0.015, 12, 48);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc21515, roughness: 0.2, metalness: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.005;
    girl.add(ring);

    // Body root
    const body = new THREE.Group();
    girl.add(body);

    // Hips
    const hips = new THREE.Group();
    hips.position.y = 0.94;
    body.add(hips);

    const pelvisGeo = new THREE.BoxGeometry(0.32, 0.18, 0.22);
    const pelvis = new THREE.Mesh(pelvisGeo, pantsMat);
    hips.add(pelvis);

    const beltGeo = new THREE.BoxGeometry(0.33, 0.05, 0.23);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 0.07;
    hips.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.06, 0.05, 0.02);
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, 0.07, 0.12);
    hips.add(buckle);

    // Torso
    const torso = new THREE.Group();
    torso.position.y = 0.08;
    hips.add(torso);

    const lowerTorsoGeo = new THREE.BoxGeometry(0.30, 0.20, 0.20);
    const lowerTorso = new THREE.Mesh(lowerTorsoGeo, shirtMat);
    lowerTorso.position.y = 0.10;
    torso.add(lowerTorso);

    const jacketGeo = new THREE.BoxGeometry(0.36, 0.38, 0.24);
    const jacket = new THREE.Mesh(jacketGeo, jacketMat);
    jacket.position.y = 0.29;
    torso.add(jacket);

    const collarGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.08, 16);
    const collar = new THREE.Mesh(collarGeo, jacketMat);
    collar.position.y = 0.48;
    torso.add(collar);

    const shirtGeo = new THREE.BoxGeometry(0.14, 0.28, 0.04);
    const shirt = new THREE.Mesh(shirtGeo, shirtMat);
    shirt.position.set(0, 0.32, 0.11);
    torso.add(shirt);

    const zipperGeo = new THREE.BoxGeometry(0.02, 0.38, 0.03);
    const zipper = new THREE.Mesh(zipperGeo, jacketTrimMat);
    zipper.position.set(0, 0.31, 0.22);
    torso.add(zipper);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.16, 14);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.55;
    torso.add(neck);

    // Head Group
    const head = new THREE.Group();
    head.position.y = 0.73;
    torso.add(head);

    // Head mesh - sculpted cranium
    const headGeo = new THREE.SphereGeometry(0.21, 20, 18);
    headGeo.scale(0.92, 1.05, 0.98);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    head.add(headMesh);

    // Soft rounded chin & jaw contour
    const chinGeo = new THREE.SphereGeometry(0.08, 14, 12);
    chinGeo.scale(1.0, 0.85, 0.9);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.11, 0.08);
    head.add(chin);

    // Nose
    const noseBridgeGeo = new THREE.BoxGeometry(0.025, 0.07, 0.04);
    const noseBridge = new THREE.Mesh(noseBridgeGeo, skinMat);
    noseBridge.position.set(0, 0.01, 0.20);
    noseBridge.rotation.x = 0.2;
    head.add(noseBridge);

    const noseTipGeo = new THREE.SphereGeometry(0.022, 10, 8);
    const noseTip = new THREE.Mesh(noseTipGeo, skinMat);
    noseTip.position.set(0, -0.025, 0.215);
    head.add(noseTip);

    // Lips
    const upperLipGeo = new THREE.BoxGeometry(0.055, 0.018, 0.02);
    const upperLip = new THREE.Mesh(upperLipGeo, lipMat);
    upperLip.position.set(0, -0.072, 0.195);
    head.add(upperLip);

    const lowerLipGeo = new THREE.BoxGeometry(0.045, 0.02, 0.022);
    const lowerLip = new THREE.Mesh(lowerLipGeo, lipMat);
    lowerLip.position.set(0, -0.092, 0.19);
    head.add(lowerLip);

    // Eyes
    const createEye = (x, isLeft) => {
        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(x, 0.035, 0.185);
        eyeGroup.rotation.y = isLeft ? -0.15 : 0.15;

        const scleraGeo = new THREE.SphereGeometry(0.038, 12, 10);
        scleraGeo.scale(0.9, 0.75, 0.4);
        const sclera = new THREE.Mesh(scleraGeo, scleraMat);
        eyeGroup.add(sclera);

        const irisGeo = new THREE.CircleGeometry(0.022, 12);
        const iris = new THREE.Mesh(irisGeo, irisMat);
        iris.position.set(0, 0, 0.018);
        eyeGroup.add(iris);

        const pupilGeo = new THREE.CircleGeometry(0.012, 10);
        const pupil = new THREE.Mesh(pupilGeo, pupilMat);
        pupil.position.set(0, 0, 0.019);
        eyeGroup.add(pupil);

        const browGeo = new THREE.BoxGeometry(0.065, 0.014, 0.02);
        const brow = new THREE.Mesh(browGeo, browMat);
        brow.position.set(0, 0.055, 0.015);
        brow.rotation.z = isLeft ? -0.1 : 0.1;
        eyeGroup.add(brow);

        return eyeGroup;
    };

    head.add(createEye(-0.085, true));
    head.add(createEye(0.085, false));

    // Blush
    const blushGeo = new THREE.CircleGeometry(0.035, 10);
    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.12, -0.04, 0.17);
    leftBlush.rotation.y = -0.35;
    head.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.12, -0.04, 0.17);
    rightBlush.rotation.y = 0.35;
    head.add(rightBlush);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.04, 10, 8);
    earGeo.scale(0.4, 0.8, 0.5);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(-0.195, 0.01, 0);
    leftEar.rotation.z = -0.15;
    head.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, skinMat);
    rightEar.position.set(0.195, 0.01, 0);
    rightEar.rotation.z = 0.15;
    head.add(rightEar);

    // Natural Organic Hair Styling
    const hairCrownGeo = new THREE.SphereGeometry(0.24, 22, 18);
    hairCrownGeo.scale(1.02, 1.05, 1.08);
    const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
    hairCrown.position.set(0, 0.05, -0.025);
    head.add(hairCrown);

    // Back flowing hair group
    const backHair = new THREE.Group();
    backHair.position.set(0, -0.06, -0.16);
    head.add(backHair);

    const backVolumeGeo = new THREE.CapsuleGeometry(0.12, 0.22, 8, 14);
    const backVolume = new THREE.Mesh(backVolumeGeo, hairMat);
    backVolume.rotation.x = 0.22;
    backHair.add(backVolume);

    const backCenterGeo = new THREE.CapsuleGeometry(0.08, 0.26, 8, 12);
    const backCenter = new THREE.Mesh(backCenterGeo, hairMat);
    backCenter.position.set(0, -0.13, -0.02);
    backCenter.rotation.x = 0.28;
    backHair.add(backCenter);

    const backLeftGeo = new THREE.CapsuleGeometry(0.07, 0.24, 8, 12);
    const backLeft = new THREE.Mesh(backLeftGeo, hairMat);
    backLeft.position.set(-0.10, -0.11, 0);
    backLeft.rotation.set(0.25, 0.1, -0.14);
    backHair.add(backLeft);

    const backRightGeo = new THREE.CapsuleGeometry(0.07, 0.24, 8, 12);
    const backRight = new THREE.Mesh(backRightGeo, hairMat);
    backRight.position.set(0.10, -0.11, 0);
    backRight.rotation.set(0.25, -0.1, 0.14);
    backHair.add(backRight);

    // Curtain bangs
    const leftBangGeo = new THREE.CapsuleGeometry(0.045, 0.16, 8, 12);
    const leftBang = new THREE.Mesh(leftBangGeo, hairMat);
    leftBang.position.set(-0.08, 0.11, 0.15);
    leftBang.rotation.set(0.25, 0.15, -0.42);
    head.add(leftBang);

    const rightBangGeo = new THREE.CapsuleGeometry(0.045, 0.16, 8, 12);
    const rightBang = new THREE.Mesh(rightBangGeo, hairMat);
    rightBang.position.set(0.08, 0.11, 0.15);
    rightBang.rotation.set(0.25, -0.15, 0.42);
    head.add(rightBang);

    const centerBangGeo = new THREE.CapsuleGeometry(0.035, 0.10, 6, 10);
    const centerBang = new THREE.Mesh(centerBangGeo, hairMat);
    centerBang.position.set(0, 0.13, 0.16);
    centerBang.rotation.x = 0.28;
    head.add(centerBang);

    // Face-framing locks
    const leftLockGeo = new THREE.CapsuleGeometry(0.045, 0.30, 8, 12);
    const leftLock = new THREE.Mesh(leftLockGeo, hairMat);
    leftLock.position.set(-0.17, -0.08, 0.07);
    leftLock.rotation.set(0.10, 0.08, 0.12);
    head.add(leftLock);

    const rightLockGeo = new THREE.CapsuleGeometry(0.045, 0.30, 8, 12);
    const rightLock = new THREE.Mesh(rightLockGeo, hairMat);
    rightLock.position.set(0.17, -0.08, 0.07);
    rightLock.rotation.set(0.10, -0.08, -0.12);
    head.add(rightLock);

    // Headphones around neck
    const headphoneBandGeo = new THREE.TorusGeometry(0.16, 0.018, 8, 20, Math.PI * 0.85);
    const headphoneBand = new THREE.Mesh(headphoneBandGeo, headphoneMat);
    headphoneBand.position.set(0, 0.50, 0.04);
    headphoneBand.rotation.x = Math.PI * 0.65;
    headphoneBand.rotation.z = -Math.PI * 0.42;
    torso.add(headphoneBand);

    const earcupGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 14);
    const leftEarcup = new THREE.Mesh(earcupGeo, headphonePadMat);
    leftEarcup.position.set(-0.16, 0.48, 0.09);
    leftEarcup.rotation.z = 0.5;
    torso.add(leftEarcup);

    const rightEarcup = new THREE.Mesh(earcupGeo, headphonePadMat);
    rightEarcup.position.set(0.16, 0.48, 0.09);
    rightEarcup.rotation.z = -0.5;
    torso.add(rightEarcup);

    // Arms
    const createArm = (isLeft) => {
        const armRoot = new THREE.Group();
        const side = isLeft ? -1 : 1;
        armRoot.position.set(side * 0.23, 0.40, 0.02);

        const shoulderGeo = new THREE.SphereGeometry(0.065, 12, 10);
        const shoulder = new THREE.Mesh(shoulderGeo, jacketMat);
        armRoot.add(shoulder);

        const upperArmGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.24, 10);
        const upperArm = new THREE.Mesh(upperArmGeo, jacketMat);
        upperArm.position.y = -0.11;
        upperArm.rotation.z = side * 0.08;
        armRoot.add(upperArm);

        const forearm = new THREE.Group();
        forearm.position.y = -0.23;
        armRoot.add(forearm);

        const lowerArmGeo = new THREE.CylinderGeometry(0.048, 0.042, 0.22, 10);
        const lowerArm = new THREE.Mesh(lowerArmGeo, skinMat);
        lowerArm.position.y = -0.10;
        forearm.add(lowerArm);

        const cuffGeo = new THREE.CylinderGeometry(0.055, 0.052, 0.05, 10);
        const cuff = new THREE.Mesh(cuffGeo, jacketTrimMat);
        cuff.position.y = 0.01;
        forearm.add(cuff);

        const handGeo = new THREE.BoxGeometry(0.06, 0.09, 0.04);
        const hand = new THREE.Mesh(handGeo, skinMat);
        hand.position.y = -0.23;
        forearm.add(hand);

        return armRoot;
    };

    torso.add(createArm(true));
    torso.add(createArm(false));

    // Legs
    const createLeg = (offsetX) => {
        const legRoot = new THREE.Group();
        legRoot.position.set(offsetX, -0.06, 0);

        const thighGeo = new THREE.CylinderGeometry(0.085, 0.068, 0.44, 12);
        const thigh = new THREE.Mesh(thighGeo, pantsMat);
        thigh.position.y = -0.22;
        legRoot.add(thigh);

        const lowerLeg = new THREE.Group();
        lowerLeg.position.y = -0.44;
        legRoot.add(lowerLeg);

        const calfGeo = new THREE.CylinderGeometry(0.066, 0.054, 0.40, 12);
        const calf = new THREE.Mesh(calfGeo, pantsMat);
        calf.position.y = -0.20;
        lowerLeg.add(calf);

        const shoeGroup = new THREE.Group();
        shoeGroup.position.set(0, -0.40, 0.04);
        lowerLeg.add(shoeGroup);

        const shoeSoleGeo = new THREE.BoxGeometry(0.10, 0.06, 0.22);
        const shoeSole = new THREE.Mesh(shoeSoleGeo, shoeMat);
        shoeGroup.add(shoeSole);

        const shoeToeGeo = new THREE.SphereGeometry(0.065, 10, 8);
        shoeToeGeo.scale(0.8, 0.6, 1.0);
        const shoeToe = new THREE.Mesh(shoeToeGeo, shoeMat);
        shoeToe.position.set(0, 0.02, 0.06);
        shoeGroup.add(shoeToe);

        const accentGeo = new THREE.BoxGeometry(0.105, 0.02, 0.12);
        const accent = new THREE.Mesh(accentGeo, shoeAccentMat);
        accent.position.set(0, 0.03, 0);
        shoeGroup.add(accent);

        return legRoot;
    };

    hips.add(createLeg(-0.115));
    hips.add(createLeg(0.115));

    return girl;
}

async function exportModels() {
    const character = buildAditiCharacter();
    const gltfExporter = new GLTFExporter();
    const usdzExporter = new USDZExporter();

    const outputDir = path.resolve(__dirname, '../static/ar');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const glbPath = path.join(outputDir, 'aditi-avatar.glb');
    const usdzPath = path.join(outputDir, 'aditi-avatar.usdz');

    try {
        const gltf = await gltfExporter.parseAsync(character, { binary: true });
        const glbBuffer = Buffer.from(gltf);
        fs.writeFileSync(glbPath, glbBuffer);
        console.log(`Successfully generated AR GLB model: ${glbPath} (${glbBuffer.length} bytes)`);

        await new Promise((resolve, reject) => {
            usdzExporter.parse(character, (usdzData) => {
                try {
                    const usdzBuffer = Buffer.from(usdzData);
                    fs.writeFileSync(usdzPath, usdzBuffer);
                    console.log(`Successfully generated AR USDZ model for iOS: ${usdzPath} (${usdzBuffer.length} bytes)`);
                    resolve();
                } catch(e) {
                    reject(e);
                }
            }, reject);
        });
    } catch(error) {
        console.error('Error exporting 3D models:', error);
        process.exit(1);
    }
}

exportModels();
