import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import { Track } from '../Tracks.js'
import { Trails } from '../Trails.js'
import { remapClamp } from '../utilities/maths.js'
import { cameraPosition, color, Fn, min, mix, normalWorld, positionViewDirection, positionWorld, screenCoordinate, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl'
import { clamp } from 'three/src/math/MathUtils.js'
import gsap from 'gsap'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'

export class VisualVehicle
{
    constructor(model)
    {
        this.game = Game.getInstance()
        this.model = model

        this.walkPhase = 0
        this.idlePhase = 0
        this.facingAngle = 0

        this.setParts()
        this.setMainGroundTrack()
        this.setWheels()
        this.setScreenPosition()

        // Create Girl Character (Aditi)
        this.createCharacter()

        this.tickCallback = () =>
        {
            this.update()
        }
        this.game.ticker.events.on('tick', this.tickCallback, 8)
    }

    destroy()
    {
        this.game.ticker.events.off('tick', this.tickCallback)

        if(this.girl && this.girl.root)
            this.girl.root.removeFromParent()

        if(this.beaconMesh)
            this.beaconMesh.removeFromParent()

        for(let partName in this.parts)
        {
            const part = this.parts[partName]
            part.removeFromParent()
        }

        this.game.tracks.remove(this.mainGroundTrack)

        for(const wheel of this.wheels.items)
        {
            this.game.tracks.remove(wheel.groundTrack)
        }
    }

    createCharacter()
    {
        const girl = new THREE.Group()
        girl.name = 'aditiCharacter'

        // Refined realistic color palette & materials
        const skinMat = new MeshDefaultMaterial({
            colorNode: color('#f5d0bc'), // Natural warm skin
            hasWater: false
        })
        const skinShadowMat = new MeshDefaultMaterial({
            colorNode: color('#e5bca8'),
            hasWater: false
        })
        const hairMat = new MeshDefaultMaterial({
            colorNode: color('#221714'), // Deep espresso brunette
            hasWater: false
        })
        const hairTieMat = new MeshDefaultMaterial({
            colorNode: color('#e11d48'),
            hasWater: false
        })
        const scleraMat = new MeshDefaultMaterial({
            colorNode: color('#ffffff'),
            hasWater: false
        })
        const irisMat = new MeshDefaultMaterial({
            colorNode: color('#3b2219'), // Warm dark amber-brown iris
            hasWater: false
        })
        const pupilMat = new MeshDefaultMaterial({
            colorNode: color('#0a0a0f'),
            hasWater: false
        })
        const catchlightMat = new MeshDefaultMaterial({
            colorNode: color('#ffffff'),
            hasWater: false
        })
        const browMat = new MeshDefaultMaterial({
            colorNode: color('#251a17'),
            hasWater: false
        })
        const lipMat = new MeshDefaultMaterial({
            colorNode: color('#cf6e68'), // Soft rose lip tint
            hasWater: false
        })
        const blushMat = new MeshDefaultMaterial({
            colorNode: color('#ffb0b0'),
            hasWater: false
        })
        const jacketMat = new MeshDefaultMaterial({
            colorNode: color('#1e293b'), // Sleek dark slate/navy tech bomber
            hasWater: false
        })
        const jacketTrimMat = new MeshDefaultMaterial({
            colorNode: color('#94a3b8'), // Metallic chrome zipper & accents
            hasWater: false
        })
        const shirtMat = new MeshDefaultMaterial({
            colorNode: color('#f8fafc'), // Clean white crew tee
            hasWater: false
        })
        const pantsMat = new MeshDefaultMaterial({
            colorNode: color('#0f172a'), // Tailored midnight slim trousers
            hasWater: false
        })
        const beltMat = new MeshDefaultMaterial({
            colorNode: color('#334155'),
            hasWater: false
        })
        const buckleMat = new MeshDefaultMaterial({
            colorNode: color('#cbd5e1'),
            hasWater: false
        })
        const headphoneMat = new MeshDefaultMaterial({
            colorNode: color('#475569'), // Metallic graphite headphones
            hasWater: false
        })
        const headphonePadMat = new MeshDefaultMaterial({
            colorNode: color('#0f172a'),
            hasWater: false
        })
        const watchMat = new MeshDefaultMaterial({
            colorNode: color('#38bdf8'), // Glowing cyan smartwatch screen
            hasWater: false
        })
        const shoeSoleMat = new MeshDefaultMaterial({
            colorNode: color('#ffffff'),
            hasWater: false
        })
        const shoeTreadMat = new MeshDefaultMaterial({
            colorNode: color('#1e293b'),
            hasWater: false
        })
        const shoeUpperMat = new MeshDefaultMaterial({
            colorNode: color('#e2e8f0'),
            hasWater: false
        })
        const shoeAccentMat = new MeshDefaultMaterial({
            colorNode: color('#3b82f6'), // Electric blue runner accent
            hasWater: false
        })

        // Root container for body animations (bob, sway, breathing)
        const body = new THREE.Group()
        girl.add(body)

        // Hips / Pelvis
        const hips = new THREE.Group()
        hips.position.y = 0.94
        body.add(hips)

        // Pelvis base
        const pelvisGeo = new THREE.CylinderGeometry(0.20, 0.22, 0.16, 16)
        const pelvis = new THREE.Mesh(pelvisGeo, pantsMat)
        pelvis.position.y = -0.06
        pelvis.castShadow = true
        pelvis.receiveShadow = true
        hips.add(pelvis)

        // Waistband & belt
        const beltGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.04, 16)
        const belt = new THREE.Mesh(beltGeo, beltMat)
        belt.position.y = 0.02
        hips.add(belt)

        const buckleGeo = new THREE.BoxGeometry(0.04, 0.04, 0.02)
        const buckle = new THREE.Mesh(buckleGeo, buckleMat)
        buckle.position.set(0, 0.02, 0.215)
        hips.add(buckle)

        // Torso & Upper Body
        const torso = new THREE.Group()
        hips.add(torso)

        // Lower torso / waist
        const waistGeo = new THREE.CylinderGeometry(0.20, 0.21, 0.18, 16)
        const waist = new THREE.Mesh(waistGeo, jacketMat)
        waist.position.y = 0.12
        waist.castShadow = true
        waist.receiveShadow = true
        torso.add(waist)

        // Ribbed jacket hem
        const hemGeo = new THREE.CylinderGeometry(0.212, 0.215, 0.04, 16)
        const hem = new THREE.Mesh(hemGeo, jacketTrimMat)
        hem.position.y = 0.04
        torso.add(hem)

        // Upper torso / chest & tailored jacket
        const chestGeo = new THREE.CylinderGeometry(0.24, 0.20, 0.32, 16)
        const chest = new THREE.Mesh(chestGeo, jacketMat)
        chest.position.y = 0.34
        chest.castShadow = true
        chest.receiveShadow = true
        torso.add(chest)

        // Inner shirt collar opening
        const shirtGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.30, 12)
        const shirt = new THREE.Mesh(shirtGeo, shirtMat)
        shirt.position.set(0, 0.35, 0.09)
        shirt.scale.set(0.65, 1, 0.35)
        torso.add(shirt)

        // Metallic jacket zipper runner
        const zipperGeo = new THREE.BoxGeometry(0.02, 0.38, 0.03)
        const zipper = new THREE.Mesh(zipperGeo, jacketTrimMat)
        zipper.position.set(0, 0.31, 0.22)
        torso.add(zipper)

        // Proportional slender neck
        const neckGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.16, 14)
        const neck = new THREE.Mesh(neckGeo, skinMat)
        neck.position.y = 0.55
        torso.add(neck)

        // Head Group (sculpted human skull proportions)
        const head = new THREE.Group()
        head.position.y = 0.73
        torso.add(head)

        // Head mesh - sculpted cranium
        const headGeo = new THREE.SphereGeometry(0.21, 20, 18)
        headGeo.scale(0.92, 1.05, 0.98)
        const headMesh = new THREE.Mesh(headGeo, skinMat)
        headMesh.castShadow = true
        headMesh.receiveShadow = true
        head.add(headMesh)

        // Soft rounded chin & jaw contour
        const chinGeo = new THREE.SphereGeometry(0.08, 14, 12)
        chinGeo.scale(1.0, 0.85, 0.9)
        const chin = new THREE.Mesh(chinGeo, skinMat)
        chin.position.set(0, -0.11, 0.08)
        head.add(chin)

        // Nose bridge & soft tip
        const noseBridgeGeo = new THREE.BoxGeometry(0.025, 0.07, 0.04)
        const noseBridge = new THREE.Mesh(noseBridgeGeo, skinMat)
        noseBridge.position.set(0, 0.01, 0.20)
        noseBridge.rotation.x = 0.2
        head.add(noseBridge)

        const noseTipGeo = new THREE.SphereGeometry(0.022, 10, 8)
        const noseTip = new THREE.Mesh(noseTipGeo, skinMat)
        noseTip.position.set(0, -0.025, 0.215)
        head.add(noseTip)

        // Contoured Lips
        const upperLipGeo = new THREE.BoxGeometry(0.055, 0.018, 0.02)
        const upperLip = new THREE.Mesh(upperLipGeo, lipMat)
        upperLip.position.set(0, -0.072, 0.195)
        head.add(upperLip)

        const lowerLipGeo = new THREE.BoxGeometry(0.045, 0.02, 0.022)
        const lowerLip = new THREE.Mesh(lowerLipGeo, lipMat)
        lowerLip.position.set(0, -0.092, 0.19)
        head.add(lowerLip)

        // Realistic Eyes (Sclera + Iris + Pupil + Specular Glint + Eyelash)
        const createEye = (x, isLeft) =>
        {
            const eyeGroup = new THREE.Group()
            eyeGroup.position.set(x, 0.035, 0.185)
            eyeGroup.rotation.y = isLeft ? -0.15 : 0.15

            // Sclera (eye white)
            const scleraGeo = new THREE.SphereGeometry(0.038, 12, 10)
            scleraGeo.scale(0.9, 0.75, 0.4)
            const sclera = new THREE.Mesh(scleraGeo, scleraMat)
            eyeGroup.add(sclera)

            // Iris
            const irisGeo = new THREE.CircleGeometry(0.022, 12)
            const iris = new THREE.Mesh(irisGeo, irisMat)
            iris.position.set(0, 0, 0.018)
            eyeGroup.add(iris)

            // Pupil
            const pupilGeo = new THREE.CircleGeometry(0.012, 10)
            const pupil = new THREE.Mesh(pupilGeo, pupilMat)
            pupil.position.set(0, 0, 0.019)
            eyeGroup.add(pupil)

            // Specular Catchlight (vital for realistic lively gaze)
            const gleamGeo = new THREE.CircleGeometry(0.005, 8)
            const gleam = new THREE.Mesh(gleamGeo, catchlightMat)
            gleam.position.set(0.006, 0.006, 0.020)
            eyeGroup.add(gleam)

            // Upper Eyelash / Lash line contour
            const lashGeo = new THREE.BoxGeometry(0.065, 0.01, 0.02)
            const lash = new THREE.Mesh(lashGeo, pupilMat)
            lash.position.set(0, 0.025, 0.015)
            lash.rotation.z = isLeft ? -0.08 : 0.08
            eyeGroup.add(lash)

            // Eyebrow
            const browGeo = new THREE.BoxGeometry(0.065, 0.012, 0.015)
            const brow = new THREE.Mesh(browGeo, browMat)
            brow.position.set(0, 0.055, 0.012)
            brow.rotation.z = isLeft ? -0.1 : 0.1
            eyeGroup.add(brow)

            return eyeGroup
        }

        const leftEyeGroup = createEye(-0.085, true)
        head.add(leftEyeGroup)

        const rightEyeGroup = createEye(0.085, false)
        head.add(rightEyeGroup)

        // Soft cheek blush
        const blushGeo = new THREE.CircleGeometry(0.035, 10)
        const leftBlush = new THREE.Mesh(blushGeo, blushMat)
        leftBlush.position.set(-0.12, -0.04, 0.17)
        leftBlush.rotation.y = -0.35
        head.add(leftBlush)

        const rightBlush = new THREE.Mesh(blushGeo, blushMat)
        rightBlush.position.set(0.12, -0.04, 0.17)
        rightBlush.rotation.y = 0.35
        head.add(rightBlush)

        // Ears
        const earGeo = new THREE.SphereGeometry(0.04, 10, 8)
        earGeo.scale(0.4, 0.8, 0.5)
        const leftEar = new THREE.Mesh(earGeo, skinMat)
        leftEar.position.set(-0.195, 0.01, 0)
        leftEar.rotation.z = -0.15
        head.add(leftEar)

        const rightEar = new THREE.Mesh(earGeo, skinMat)
        rightEar.position.set(0.195, 0.01, 0)
        rightEar.rotation.z = 0.15
        head.add(rightEar)

        // Realistic Organic Hair Styling (Full volume crown, soft curtain bangs, cascading tresses, side locks)
        const hairCrownGeo = new THREE.SphereGeometry(0.24, 22, 18)
        hairCrownGeo.scale(1.02, 1.05, 1.08)
        const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat)
        hairCrown.position.set(0, 0.05, -0.025)
        hairCrown.castShadow = true
        head.add(hairCrown)

        // Back flowing hair group (natural drape that sways gently with movement)
        const backHair = new THREE.Group()
        backHair.position.set(0, -0.06, -0.16)
        head.add(backHair)

        // Upper back volume (natural smooth drape behind skull)
        const backVolumeGeo = new THREE.CapsuleGeometry(0.12, 0.22, 8, 14)
        const backVolume = new THREE.Mesh(backVolumeGeo, hairMat)
        backVolume.rotation.x = 0.22
        backVolume.castShadow = true
        backHair.add(backVolume)

        // Cascading smooth back tresses flowing naturally over neck and shoulders
        const backCenterGeo = new THREE.CapsuleGeometry(0.08, 0.26, 8, 12)
        const backCenter = new THREE.Mesh(backCenterGeo, hairMat)
        backCenter.position.set(0, -0.13, -0.02)
        backCenter.rotation.x = 0.28
        backCenter.castShadow = true
        backHair.add(backCenter)

        const backLeftGeo = new THREE.CapsuleGeometry(0.07, 0.24, 8, 12)
        const backLeft = new THREE.Mesh(backLeftGeo, hairMat)
        backLeft.position.set(-0.10, -0.11, 0)
        backLeft.rotation.set(0.25, 0.1, -0.14)
        backLeft.castShadow = true
        backHair.add(backLeft)

        const backRightGeo = new THREE.CapsuleGeometry(0.07, 0.24, 8, 12)
        const backRight = new THREE.Mesh(backRightGeo, hairMat)
        backRight.position.set(0.10, -0.11, 0)
        backRight.rotation.set(0.25, -0.1, 0.14)
        backRight.castShadow = true
        backHair.add(backRight)

        // Soft curved curtain bangs framing the forehead
        const leftBangGeo = new THREE.CapsuleGeometry(0.045, 0.16, 8, 12)
        const leftBang = new THREE.Mesh(leftBangGeo, hairMat)
        leftBang.position.set(-0.08, 0.11, 0.15)
        leftBang.rotation.set(0.25, 0.15, -0.42)
        head.add(leftBang)

        const rightBangGeo = new THREE.CapsuleGeometry(0.045, 0.16, 8, 12)
        const rightBang = new THREE.Mesh(rightBangGeo, hairMat)
        rightBang.position.set(0.08, 0.11, 0.15)
        rightBang.rotation.set(0.25, -0.15, 0.42)
        head.add(rightBang)

        // Center hairline tuft
        const centerBangGeo = new THREE.CapsuleGeometry(0.035, 0.10, 6, 10)
        const centerBang = new THREE.Mesh(centerBangGeo, hairMat)
        centerBang.position.set(0, 0.13, 0.16)
        centerBang.rotation.x = 0.28
        head.add(centerBang)

        // Face-framing smooth front locks (curving gently down cheeks and jaw)
        const leftLockGeo = new THREE.CapsuleGeometry(0.045, 0.30, 8, 12)
        const leftLock = new THREE.Mesh(leftLockGeo, hairMat)
        leftLock.position.set(-0.17, -0.08, 0.07)
        leftLock.rotation.set(0.10, 0.08, 0.12)
        head.add(leftLock)

        const rightLockGeo = new THREE.CapsuleGeometry(0.045, 0.30, 8, 12)
        const rightLock = new THREE.Mesh(rightLockGeo, hairMat)
        rightLock.position.set(0.17, -0.08, 0.07)
        rightLock.rotation.set(0.10, -0.08, -0.12)
        head.add(rightLock)

        // Stylish wireless headphones around neck
        const headphoneBandGeo = new THREE.TorusGeometry(0.16, 0.018, 8, 20, Math.PI * 0.85)
        const headphoneBand = new THREE.Mesh(headphoneBandGeo, headphoneMat)
        headphoneBand.position.set(0, 0.50, 0.04)
        headphoneBand.rotation.x = Math.PI * 0.65
        headphoneBand.rotation.z = -Math.PI * 0.42
        torso.add(headphoneBand)

        const earcupGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 14)
        const leftEarcup = new THREE.Mesh(earcupGeo, headphonePadMat)
        leftEarcup.position.set(-0.16, 0.48, 0.09)
        leftEarcup.rotation.z = 0.5
        torso.add(leftEarcup)

        const rightEarcup = new THREE.Mesh(earcupGeo, headphonePadMat)
        rightEarcup.position.set(0.16, 0.48, 0.09)
        rightEarcup.rotation.z = -0.5
        torso.add(rightEarcup)

        // Arms & Articulated Hands
        const createArm = (x, isLeft) =>
        {
            const armRoot = new THREE.Group()
            armRoot.position.set(x, 0.44, 0)
            torso.add(armRoot)

            // Shoulder pad & upper arm
            const upperArmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.28, 12)
            const upperArm = new THREE.Mesh(upperArmGeo, jacketMat)
            upperArm.position.y = -0.14
            upperArm.castShadow = true
            armRoot.add(upperArm)

            // Elbow / Forearm group
            const forearm = new THREE.Group()
            forearm.position.y = -0.28
            armRoot.add(forearm)

            const lowerArmGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.24, 12)
            const lowerArm = new THREE.Mesh(lowerArmGeo, jacketMat)
            lowerArm.position.y = -0.12
            lowerArm.castShadow = true
            forearm.add(lowerArm)

            // Wrist cuff
            const wristGeo = new THREE.CylinderGeometry(0.042, 0.040, 0.04, 12)
            const wrist = new THREE.Mesh(wristGeo, skinMat)
            wrist.position.y = -0.24
            forearm.add(wrist)

            // Smartwatch on left wrist
            if(isLeft)
            {
                const watchBandGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.03, 12)
                const watchBand = new THREE.Mesh(watchBandGeo, pantsMat)
                watchBand.position.y = -0.235
                forearm.add(watchBand)

                const watchFaceGeo = new THREE.BoxGeometry(0.03, 0.03, 0.015)
                const watchFace = new THREE.Mesh(watchFaceGeo, watchMat)
                watchFace.position.set(-0.042, -0.235, 0)
                forearm.add(watchFace)
            }

            // Realistic articulated hand (Palm + Thumb + Curved Fingers)
            const handGroup = new THREE.Group()
            handGroup.position.y = -0.27
            forearm.add(handGroup)

            const palmGeo = new THREE.BoxGeometry(0.055, 0.065, 0.03)
            const palm = new THREE.Mesh(palmGeo, skinMat)
            palm.position.y = -0.03
            handGroup.add(palm)

            // Thumb
            const thumbGeo = new THREE.BoxGeometry(0.02, 0.04, 0.02)
            const thumb = new THREE.Mesh(thumbGeo, skinMat)
            thumb.position.set(isLeft ? 0.032 : -0.032, -0.02, 0.01)
            thumb.rotation.z = isLeft ? -0.4 : 0.4
            handGroup.add(thumb)

            // Relaxed fingers
            const fingersGeo = new THREE.BoxGeometry(0.048, 0.045, 0.025)
            const fingers = new THREE.Mesh(fingersGeo, skinMat)
            fingers.position.set(0, -0.075, 0.005)
            fingers.rotation.x = 0.2
            handGroup.add(fingers)

            return { armRoot, forearm }
        }

        const leftArmObj = createArm(-0.29, true)
        const rightArmObj = createArm(0.29, false)

        const leftArm = leftArmObj.armRoot
        const leftForearm = leftArmObj.forearm
        const rightArm = rightArmObj.armRoot
        const rightForearm = rightArmObj.forearm

        leftArm.rotation.z = 0.12
        rightArm.rotation.z = -0.12

        // Legs & Modern Athletic Sneakers
        const createLeg = (x) =>
        {
            const legRoot = new THREE.Group()
            legRoot.position.set(x, 0, 0)
            hips.add(legRoot)

            // Upper leg / thigh
            const thighGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.44, 14)
            const thigh = new THREE.Mesh(thighGeo, pantsMat)
            thigh.position.y = -0.22
            thigh.castShadow = true
            legRoot.add(thigh)

            // Knee & lower leg
            const lowerLeg = new THREE.Group()
            lowerLeg.position.y = -0.44
            legRoot.add(lowerLeg)

            const calfGeo = new THREE.CylinderGeometry(0.07, 0.055, 0.40, 14)
            const calf = new THREE.Mesh(calfGeo, pantsMat)
            calf.position.y = -0.20
            calf.castShadow = true
            lowerLeg.add(calf)

            // Sneaker Group
            const shoeGroup = new THREE.Group()
            shoeGroup.position.set(0, -0.40, 0.05)
            lowerLeg.add(shoeGroup)

            // Outsole rubber tread
            const treadGeo = new THREE.BoxGeometry(0.12, 0.025, 0.28)
            const tread = new THREE.Mesh(treadGeo, shoeTreadMat)
            tread.position.y = -0.045
            shoeGroup.add(tread)

            // Cushioned white midsole
            const midsoleGeo = new THREE.BoxGeometry(0.125, 0.04, 0.285)
            const midsole = new THREE.Mesh(midsoleGeo, shoeSoleMat)
            midsole.position.y = -0.015
            midsole.castShadow = true
            shoeGroup.add(midsole)

            // Upper body of sneaker
            const upperShoeGeo = new THREE.BoxGeometry(0.115, 0.07, 0.27)
            const upperShoe = new THREE.Mesh(upperShoeGeo, shoeUpperMat)
            upperShoe.position.set(0, 0.035, 0)
            upperShoe.castShadow = true
            shoeGroup.add(upperShoe)

            // Sneaker Toe Cap
            const toeCapGeo = new THREE.SphereGeometry(0.055, 10, 8)
            toeCapGeo.scale(1.05, 0.6, 1)
            const toeCap = new THREE.Mesh(toeCapGeo, shoeUpperMat)
            toeCap.position.set(0, 0.01, 0.10)
            shoeGroup.add(toeCap)

            // Athletic Accent Stripe
            const accentGeo = new THREE.BoxGeometry(0.126, 0.025, 0.16)
            const accent = new THREE.Mesh(accentGeo, shoeAccentMat)
            accent.position.set(0, 0.04, -0.01)
            shoeGroup.add(accent)

            return { legRoot, lowerLeg }
        }

        const leftLegObj = createLeg(-0.115)
        const rightLegObj = createLeg(0.115)

        const leftLeg = leftLegObj.legRoot
        const leftLowerLeg = leftLegObj.lowerLeg
        const rightLeg = rightLegObj.legRoot
        const rightLowerLeg = rightLegObj.lowerLeg

        // Add character directly to scene
        this.game.scene.add(girl)

        this.girl = {
            root: girl,
            body: body,
            hips: hips,
            torso: torso,
            head: head,
            ponytail: backHair,
            hair: backHair,
            leftArm: leftArm,
            leftForearm: leftForearm,
            rightArm: rightArm,
            rightForearm: rightForearm,
            leftLeg: leftLeg,
            leftLowerLeg: leftLowerLeg,
            rightLeg: rightLeg,
            rightLowerLeg: rightLowerLeg,
        }
    }

    setParts()
    {
        this.parts = {}

        const searchList = [
            'bodyPainted',
            'chassis',
            'blinkerLeft',
            'blinkerRight',
            'stopLights',
            'backLights',
            'wheelContainer',
            'antenna',
            'cell1',
            'cell2',
            'cell3',
            'energy',
        ]
        for(let i = 0; i < searchList.length; i++)
        {
            searchList[i] = new RegExp(`^(${searchList[i]})`, 'i')
        }

        this.model.traverse((child) =>
        {
            for(const search of searchList)
            {
                const match = child.name.match(search)
                if(match)
                {
                    this.parts[match[0]] = child
                }
            }
        })

        // Hide all car geometry
        this.model.visible = false
        this.model.traverse((child) =>
        {
            if(child.isMesh)
            {
                child.visible = false
            }
        })

        // Chassis dummy object kept for internal tracking & screenPosition
        if(this.parts.chassis)
        {
            this.parts.chassis.visible = false
            this.game.scene.add(this.parts.chassis)
        }
        else
        {
            this.parts.chassis = new THREE.Group()
            this.game.scene.add(this.parts.chassis)
        }
    }

    setWheels()
    {
        this.wheels = {}
        this.wheels.items = []
        this.wheels.steering = 0

        for(let i = 0; i < 4; i++)
        {
            const wheel = {}
            wheel.container = new THREE.Group()
            wheel.container.visible = false
            wheel.cylinder = new THREE.Group()
            wheel.groundTrack = { update: () => {} }
            this.wheels.items.push(wheel)
        }
    }

    setMainGroundTrack()
    {
        this.mainGroundTrack = { update: () => {} }
    }

    setScreenPosition()
    {
        this.screenPosition = new THREE.Vector2(0, 0)
    }

    update()
    {
        const physicalVehicle = this.game.physicalVehicle
        const delta = this.game.ticker.deltaScaled

        // Keep chassis dummy in sync for camera focus point & see-through foliage
        this.parts.chassis.position.copy(physicalVehicle.position)

        if(!this.girl)
            return

        // Velocity & speed
        const vx = physicalVehicle.velocity.x
        const vz = physicalVehicle.velocity.z
        const speed = Math.hypot(vx, vz)

        // Position girl aligned with physics body and ground
        this.girl.root.position.x = physicalVehicle.position.x
        this.girl.root.position.y = physicalVehicle.position.y - 0.45
        this.girl.root.position.z = physicalVehicle.position.z

        // Smooth facing orientation towards movement direction or chassis forward orientation
        const targetAngle = speed > 0.35 
            ? Math.atan2(vx, vz) 
            : Math.atan2(physicalVehicle.forward.x, physicalVehicle.forward.z)

        let diff = targetAngle - this.facingAngle
        while(diff < -Math.PI) diff += Math.PI * 2
        while(diff > Math.PI) diff -= Math.PI * 2
        this.facingAngle += diff * Math.min(1, delta * 14)
        this.girl.root.rotation.y = this.facingAngle

        // Locomotion walking/running/turning animation
        const isTurning = Math.abs(this.game.player.steering) > 0.05
        if(speed > 0.28 || isTurning)
        {
            const animSpeed = speed > 0.28 ? speed : Math.abs(this.game.player.steering) * 1.6
            this.walkPhase += animSpeed * delta * 7.0
            const stride = Math.sin(this.walkPhase)
            const legAmp = Math.min(0.75, 0.25 + animSpeed * 0.08)
            const armAmp = Math.min(0.65, 0.2 + animSpeed * 0.08)

            // Leg strides with natural knee flexion
            this.girl.leftLeg.rotation.x = stride * legAmp
            this.girl.rightLeg.rotation.x = -stride * legAmp
            this.girl.leftLowerLeg.rotation.x = Math.max(0, -stride) * 0.55
            this.girl.rightLowerLeg.rotation.x = Math.max(0, stride) * 0.55

            // Arms swing counter to legs
            this.girl.leftArm.rotation.x = -stride * armAmp
            this.girl.rightArm.rotation.x = stride * armAmp
            this.girl.leftForearm.rotation.x = 0.15 + Math.abs(stride) * 0.15
            this.girl.rightForearm.rotation.x = 0.15 + Math.abs(stride) * 0.15

            // Vertical gait bounce
            this.girl.hips.position.y = 0.94 + Math.abs(Math.sin(this.walkPhase * 2)) * 0.04
            
            // Dynamic hair bounce & sway
            if(this.girl.hair)
            {
                this.girl.hair.rotation.x = 0.20 + Math.sin(this.walkPhase * 2) * 0.05 + animSpeed * 0.02
                this.girl.hair.rotation.z = Math.sin(this.walkPhase) * 0.04 + (this.game.player.steering * 0.06)
            }
        }
        else
        {
            // Idle state with gentle breathing and limb relaxation
            this.idlePhase += delta * 2.2

            this.girl.leftLeg.rotation.x *= 0.88
            this.girl.rightLeg.rotation.x *= 0.88
            this.girl.leftLowerLeg.rotation.x *= 0.88
            this.girl.rightLowerLeg.rotation.x *= 0.88

            this.girl.leftArm.rotation.x *= 0.88
            this.girl.rightArm.rotation.x *= 0.88
            this.girl.leftForearm.rotation.x *= 0.88
            this.girl.rightForearm.rotation.x *= 0.88

            this.girl.hips.position.y = 0.94
            this.girl.torso.position.y = Math.sin(this.idlePhase) * 0.015
            if(this.girl.hair)
            {
                this.girl.hair.rotation.x = 0.18 + Math.sin(this.idlePhase) * 0.015
                this.girl.hair.rotation.z *= 0.9
            }
        }

        // Screen position calculation for UI & foliage see-through
        const vector = new THREE.Vector3()
        vector.setFromMatrixPosition(this.girl.root.matrixWorld)
        vector.project(this.game.view.camera)

        this.screenPosition.x = (vector.x * 0.5 + 0.5)
        this.screenPosition.y = (vector.y * -0.5 + 0.5)
    }

    pulseBeacon()
    {
        if(!this.beaconMesh)
        {
            const ringGeo = new THREE.RingGeometry(0.3, 0.45, 32)
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
                depthWrite: false
            })
            this.beaconMesh = new THREE.Mesh(ringGeo, ringMat)
            this.beaconMesh.rotation.x = -Math.PI / 2
            this.beaconMesh.visible = false
            this.game.scene.add(this.beaconMesh)
        }

        if(this.girl?.root)
        {
            this.beaconMesh.position.set(
                this.girl.root.position.x,
                this.girl.root.position.y + 0.05,
                this.girl.root.position.z
            )
            this.beaconMesh.scale.set(0.6, 0.6, 0.6)
            this.beaconMesh.material.opacity = 0.95
            this.beaconMesh.visible = true

            if(this.beaconTween)
                this.beaconTween.kill()

            this.beaconTween = gsap.timeline({
                onComplete: () =>
                {
                    this.beaconMesh.visible = false
                }
            })
            this.beaconTween.to(this.beaconMesh.scale, {
                x: 3.2,
                y: 3.2,
                z: 3.2,
                duration: 0.85,
                ease: 'power2.out'
            }, 0)
            this.beaconTween.to(this.beaconMesh.material, {
                opacity: 0,
                duration: 0.85,
                ease: 'power2.out'
            }, 0)
        }
    }
}