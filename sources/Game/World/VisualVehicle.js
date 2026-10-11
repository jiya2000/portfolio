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

        // Materials using MeshDefaultMaterial for proper lighting, shadows and fog
        const skinMat = new MeshDefaultMaterial({
            colorNode: color('#fcd3be'),
            hasWater: false
        })
        const hairMat = new MeshDefaultMaterial({
            colorNode: color('#231815'),
            hasWater: false
        })
        const hairTieMat = new MeshDefaultMaterial({
            colorNode: color('#ff4a4a'),
            hasWater: false
        })
        const jacketMat = new MeshDefaultMaterial({
            colorNode: color('#4f75ff'), // Vibrant tech cobalt jacket
            hasWater: false
        })
        const jacketTrimMat = new MeshDefaultMaterial({
            colorNode: color('#ffffff'),
            hasWater: false
        })
        const shirtMat = new MeshDefaultMaterial({
            colorNode: color('#f8f9fc'),
            hasWater: false
        })
        const pantsMat = new MeshDefaultMaterial({
            colorNode: color('#242933'), // Sleek dark pants
            hasWater: false
        })
        const shoeMat = new MeshDefaultMaterial({
            colorNode: color('#ffffff'),
            hasWater: false
        })
        const shoeAccentMat = new MeshDefaultMaterial({
            colorNode: color('#ff4a4a'),
            hasWater: false
        })
        const eyeMat = new MeshDefaultMaterial({
            colorNode: color('#12131a'),
            hasWater: false
        })
        const blushMat = new MeshDefaultMaterial({
            colorNode: color('#ff9e9e'),
            hasWater: false
        })

        // Root container for body animations (bob, sway, breathing)
        const body = new THREE.Group()
        girl.add(body)

        // Hips / Pelvis
        const hips = new THREE.Group()
        hips.position.y = 0.92
        body.add(hips)

        // Torso & Jacket
        const torso = new THREE.Group()
        hips.add(torso)

        // Lower jacket / waistband
        const waistGeo = new THREE.CylinderGeometry(0.23, 0.25, 0.22, 12)
        const waist = new THREE.Mesh(waistGeo, jacketMat)
        waist.position.y = 0.11
        waist.castShadow = true
        waist.receiveShadow = true
        torso.add(waist)

        // Upper torso / chest jacket
        const chestGeo = new THREE.CylinderGeometry(0.26, 0.23, 0.34, 12)
        const chest = new THREE.Mesh(chestGeo, jacketMat)
        chest.position.y = 0.37
        chest.castShadow = true
        chest.receiveShadow = true
        torso.add(chest)

        // Inner shirt collar (v-neck detail)
        const shirtGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.35, 8)
        const shirt = new THREE.Mesh(shirtGeo, shirtMat)
        shirt.position.set(0, 0.38, 0.08)
        shirt.scale.set(0.65, 1, 0.35)
        torso.add(shirt)

        // Jacket zipper line
        const zipperGeo = new THREE.BoxGeometry(0.025, 0.42, 0.04)
        const zipper = new THREE.Mesh(zipperGeo, jacketTrimMat)
        zipper.position.set(0, 0.32, 0.24)
        torso.add(zipper)

        // Neck
        const neckGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.14, 10)
        const neck = new THREE.Mesh(neckGeo, skinMat)
        neck.position.y = 0.57
        torso.add(neck)

        // Head Group
        const head = new THREE.Group()
        head.position.y = 0.73
        torso.add(head)

        // Stylized Cute Face
        const faceGeo = new THREE.SphereGeometry(0.25, 16, 14)
        faceGeo.scale(0.95, 1.05, 1)
        const face = new THREE.Mesh(faceGeo, skinMat)
        face.castShadow = true
        face.receiveShadow = true
        head.add(face)

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8)
        eyeGeo.scale(0.7, 1.3, 0.5)
        
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
        leftEye.position.set(-0.09, 0.02, 0.23)
        head.add(leftEye)

        const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
        rightEye.position.set(0.09, 0.02, 0.23)
        head.add(rightEye)

        // Cheeks (blush)
        const blushGeo = new THREE.CircleGeometry(0.04, 8)
        const leftBlush = new THREE.Mesh(blushGeo, blushMat)
        leftBlush.position.set(-0.13, -0.06, 0.23)
        leftBlush.rotation.y = -0.3
        head.add(leftBlush)

        const rightBlush = new THREE.Mesh(blushGeo, blushMat)
        rightBlush.position.set(0.13, -0.06, 0.23)
        rightBlush.rotation.y = 0.3
        head.add(rightBlush)

        // Hair - Main volume
        const hairTopGeo = new THREE.SphereGeometry(0.28, 14, 12)
        hairTopGeo.scale(1, 1.05, 1.05)
        const hairTop = new THREE.Mesh(hairTopGeo, hairMat)
        hairTop.position.set(0, 0.06, -0.04)
        hairTop.castShadow = true
        head.add(hairTop)

        // Bangs / Front hair fringe
        const bangsGeo = new THREE.CylinderGeometry(0.27, 0.28, 0.18, 12, 1, false, -Math.PI * 0.45, Math.PI * 0.9)
        const bangs = new THREE.Mesh(bangsGeo, hairMat)
        bangs.position.set(0, 0.12, 0.06)
        bangs.rotation.x = 0.2
        head.add(bangs)

        // Side locks
        const sideLockGeo = new THREE.ConeGeometry(0.055, 0.28, 6)
        const leftSideLock = new THREE.Mesh(sideLockGeo, hairMat)
        leftSideLock.position.set(-0.23, -0.06, 0.1)
        leftSideLock.rotation.z = 0.2
        head.add(leftSideLock)

        const rightSideLock = new THREE.Mesh(sideLockGeo, hairMat)
        rightSideLock.position.set(0.23, -0.06, 0.1)
        rightSideLock.rotation.z = -0.2
        head.add(rightSideLock)

        // Ponytail Pivot (at back of head, sways dynamically)
        const ponytail = new THREE.Group()
        ponytail.position.set(0, 0.14, -0.25)
        head.add(ponytail)

        // Hair Tie / Ribbon
        const hairTieGeo = new THREE.TorusGeometry(0.065, 0.025, 8, 12)
        const hairTie = new THREE.Mesh(hairTieGeo, hairTieMat)
        hairTie.rotation.x = Math.PI * 0.5
        ponytail.add(hairTie)

        // Ponytail hair segments
        const ponytailUpperGeo = new THREE.ConeGeometry(0.1, 0.38, 8)
        const ponytailUpper = new THREE.Mesh(ponytailUpperGeo, hairMat)
        ponytailUpper.position.set(0, -0.16, -0.08)
        ponytailUpper.rotation.x = -0.5
        ponytailUpper.castShadow = true
        ponytail.add(ponytailUpper)

        const ponytailTipGeo = new THREE.ConeGeometry(0.065, 0.3, 8)
        const ponytailTip = new THREE.Mesh(ponytailTipGeo, hairMat)
        ponytailTip.position.set(0, -0.34, -0.18)
        ponytailTip.rotation.x = -0.6
        ponytailTip.castShadow = true
        ponytail.add(ponytailTip)

        // Arms
        // Left Arm Pivot
        const leftArm = new THREE.Group()
        leftArm.position.set(-0.31, 0.45, 0)
        torso.add(leftArm)

        const upperArmGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.26, 8)
        const leftUpperArm = new THREE.Mesh(upperArmGeo, jacketMat)
        leftUpperArm.position.y = -0.13
        leftUpperArm.castShadow = true
        leftArm.add(leftUpperArm)

        const leftForearm = new THREE.Group()
        leftForearm.position.y = -0.26
        leftArm.add(leftForearm)

        const forearmGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.24, 8)
        const leftLowerArmMesh = new THREE.Mesh(forearmGeo, jacketMat)
        leftLowerArmMesh.position.y = -0.12
        leftForearm.add(leftLowerArmMesh)

        const handGeo = new THREE.SphereGeometry(0.05, 8, 8)
        const leftHand = new THREE.Mesh(handGeo, skinMat)
        leftHand.position.y = -0.23
        leftForearm.add(leftHand)

        // Right Arm Pivot
        const rightArm = new THREE.Group()
        rightArm.position.set(0.31, 0.45, 0)
        torso.add(rightArm)

        const rightUpperArm = new THREE.Mesh(upperArmGeo, jacketMat)
        rightUpperArm.position.y = -0.13
        rightUpperArm.castShadow = true
        rightArm.add(rightUpperArm)

        const rightForearm = new THREE.Group()
        rightForearm.position.y = -0.26
        rightArm.add(rightForearm)

        const rightLowerArmMesh = new THREE.Mesh(forearmGeo, jacketMat)
        rightLowerArmMesh.position.y = -0.12
        rightForearm.add(rightLowerArmMesh)

        const rightHand = new THREE.Mesh(handGeo, skinMat)
        rightHand.position.y = -0.23
        rightForearm.add(rightHand)

        // Legs
        // Left Leg Pivot
        const leftLeg = new THREE.Group()
        leftLeg.position.set(-0.12, 0, 0)
        hips.add(leftLeg)

        const upperLegGeo = new THREE.CylinderGeometry(0.095, 0.075, 0.44, 8)
        const leftUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat)
        leftUpperLeg.position.y = -0.22
        leftUpperLeg.castShadow = true
        leftLeg.add(leftUpperLeg)

        const leftLowerLeg = new THREE.Group()
        leftLowerLeg.position.y = -0.44
        leftLeg.add(leftLowerLeg)

        const lowerLegGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.4, 8)
        const leftLowerLegMesh = new THREE.Mesh(lowerLegGeo, pantsMat)
        leftLowerLegMesh.position.y = -0.2
        leftLowerLegMesh.castShadow = true
        leftLowerLeg.add(leftLowerLegMesh)

        // Sneakers
        const shoeGeo = new THREE.BoxGeometry(0.13, 0.1, 0.27)
        const leftShoe = new THREE.Mesh(shoeGeo, shoeMat)
        leftShoe.position.set(0, -0.37, 0.05)
        leftShoe.castShadow = true
        leftLowerLeg.add(leftShoe)

        const shoeAccentGeo = new THREE.BoxGeometry(0.135, 0.03, 0.275)
        const leftShoeAccent = new THREE.Mesh(shoeAccentGeo, shoeAccentMat)
        leftShoeAccent.position.set(0, -0.41, 0.05)
        leftLowerLeg.add(leftShoeAccent)

        // Right Leg Pivot
        const rightLeg = new THREE.Group()
        rightLeg.position.set(0.12, 0, 0)
        hips.add(rightLeg)

        const rightUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat)
        rightUpperLeg.position.y = -0.22
        rightUpperLeg.castShadow = true
        rightLeg.add(rightUpperLeg)

        const rightLowerLeg = new THREE.Group()
        rightLowerLeg.position.y = -0.44
        rightLeg.add(rightLowerLeg)

        const rightLowerLegMesh = new THREE.Mesh(lowerLegGeo, pantsMat)
        rightLowerLegMesh.position.y = -0.2
        rightLowerLegMesh.castShadow = true
        rightLowerLeg.add(rightLowerLegMesh)

        const rightShoe = new THREE.Mesh(shoeGeo, shoeMat)
        rightShoe.position.set(0, -0.37, 0.05)
        rightShoe.castShadow = true
        rightLowerLeg.add(rightShoe)

        const rightShoeAccent = new THREE.Mesh(shoeAccentGeo, shoeAccentMat)
        rightShoeAccent.position.set(0, -0.41, 0.05)
        rightLowerLeg.add(rightShoeAccent)

        // Initial relaxed arm pose
        leftArm.rotation.z = 0.12
        rightArm.rotation.z = -0.12

        // Add character directly to scene
        this.game.scene.add(girl)

        this.girl = {
            root: girl,
            body: body,
            hips: hips,
            torso: torso,
            head: head,
            ponytail: ponytail,
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
        this.parts.chassis.visible = false
        this.game.scene.add(this.parts.chassis)
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

        // Smooth facing orientation towards movement direction
        if(speed > 0.35)
        {
            const targetAngle = Math.atan2(vx, vz)
            let diff = targetAngle - this.facingAngle
            while(diff < -Math.PI) diff += Math.PI * 2
            while(diff > Math.PI) diff -= Math.PI * 2
            this.facingAngle += diff * Math.min(1, delta * 12)
        }
        this.girl.root.rotation.y = this.facingAngle

        // Locomotion walking/running animation
        if(speed > 0.3)
        {
            this.walkPhase += speed * delta * 6.5
            const stride = Math.sin(this.walkPhase)
            const legAmp = Math.min(0.75, 0.3 + speed * 0.08)
            const armAmp = Math.min(0.65, 0.25 + speed * 0.08)

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
            this.girl.hips.position.y = 0.92 + Math.abs(Math.sin(this.walkPhase * 2)) * 0.05
            
            // Dynamic ponytail bounce & lag
            this.girl.ponytail.rotation.x = 0.25 + Math.sin(this.walkPhase * 2) * 0.15 + speed * 0.03
            this.girl.ponytail.rotation.z = Math.sin(this.walkPhase) * 0.08
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

            this.girl.hips.position.y = 0.92
            this.girl.torso.position.y = Math.sin(this.idlePhase) * 0.015
            this.girl.head.rotation.x = Math.sin(this.idlePhase * 0.7) * 0.02
            this.girl.ponytail.rotation.x = 0.2 + Math.sin(this.idlePhase) * 0.03
            this.girl.ponytail.rotation.z *= 0.9
        }

        // Screen position calculation for UI & foliage see-through
        const vector = new THREE.Vector3()
        vector.setFromMatrixPosition(this.girl.root.matrixWorld)
        vector.project(this.game.view.camera)

        this.screenPosition.x = (vector.x * 0.5 + 0.5)
        this.screenPosition.y = (vector.y * -0.5 + 0.5)
    }
}