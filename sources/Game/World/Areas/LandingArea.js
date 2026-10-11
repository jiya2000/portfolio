import * as THREE from 'three/webgpu'
import { color, float, Fn, instancedArray, mix, normalWorld, positionGeometry, step, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl'
import { Inputs } from '../../Inputs/Inputs.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import gsap from 'gsap'
import { MeshDefaultMaterial } from '../../Materials/MeshDefaultMaterial.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import fontData from 'three/examples/fonts/helvetiker_bold.typeface.json'

export class LandingArea extends Area
{
    constructor(model)
    {
        super(model)

        this.localTime = uniform(0)

        this.setLetters()
        this.setKiosk()
        this.setControls()
        this.setBonfire()
        this.setAchievement()
    }

    setLetters()
    {
        // Hide and disable old letters
        const references = this.references.items.get('letters')
        if(references)
        {
            for(const reference of references)
            {
                if(reference.userData && reference.userData.object)
                {
                    if(reference.userData.object.visual && reference.userData.object.visual.object3D)
                    {
                        reference.userData.object.visual.object3D.visible = false
                        reference.userData.object.visual.object3D.removeFromParent()
                    }
                    if(reference.userData.object.physical && reference.userData.object.physical.body)
                    {
                        reference.userData.object.physical.body.setEnabled(false)
                    }
                }
            }
        }

        // Create 3D letters for ADITI SHARMA
        try
        {
            const fontDataRaw = fontData.default || fontData
            const font = new FontLoader().parse(fontDataRaw)
            const words = ['ADITI', 'SHARMA']
            const letterSize = 1.15
            const letterDepth = 0.46
            const letterSpacing = 0.15
            const wordSpacing = 0.75

            // World coordinates along the brick track at the landing area
            // Original letters spanned from world [38.38, 0.75, 44.25] to [49.70, 0.75, 38.97]
            const startX = 38.15
        const startY = 0.75
        const startZ = 44.35
        const dirX = 0.90630779
        const dirZ = -0.42261826
        const rotationQuat = new THREE.Quaternion(0, 0.2164396, 0, 0.976296)

        const letterMaterial = new MeshDefaultMaterial({
            colorNode: mix(color('#ff3a3a'), color('#721551'), positionGeometry.y.remapClamp(-0.6, 0.6, 0, 1)),
            hasWater: false
        })

        let currentDist = 0

        for(let w = 0; w < words.length; w++)
        {
            const word = words[w]
            for(let i = 0; i < word.length; i++)
            {
                const char = word[i]
                const geometry = new TextGeometry(char, {
                    font: font,
                    size: letterSize,
                    depth: letterDepth,
                    curveSegments: 4,
                    bevelEnabled: true,
                    bevelThickness: 0.04,
                    bevelSize: 0.03,
                    bevelSegments: 3
                })
                geometry.computeBoundingBox()
                const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x
                const height = geometry.boundingBox.max.y - geometry.boundingBox.min.y
                
                geometry.center()

                const halfWidth = width * 0.5
                currentDist += halfWidth

                const posX = startX + dirX * currentDist
                const posY = startY
                const posZ = startZ + dirZ * currentDist

                const mesh = new THREE.Mesh(geometry, letterMaterial)
                mesh.castShadow = true
                mesh.receiveShadow = true

                const object = this.game.objects.add(
                    {
                        model: mesh,
                        castShadow: true,
                        receiveShadow: true,
                        updateMaterials: false
                    },
                    {
                        type: 'dynamic',
                        position: new THREE.Vector3(posX, posY, posZ),
                        rotation: rotationQuat,
                        mass: 0.2,
                        sleeping: true,
                        colliders: [
                            {
                                shape: 'cuboid',
                                parameters: [ Math.max(0.2, halfWidth * 0.9), height * 0.5, letterDepth * 0.5 ]
                            }
                        ]
                    }
                )

                if(object.physical && object.physical.colliders && object.physical.colliders[0])
                {
                    object.physical.colliders[0].setActiveEvents(this.game.RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
                    object.physical.colliders[0].setContactForceEventThreshold(5)
                    object.physical.onCollision = (force, position) =>
                    {
                        this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
                    }
                }

                currentDist += halfWidth + letterSpacing
            }

            if(w < words.length - 1)
            {
                currentDist += wordSpacing
            }
        }
        }
        catch(error)
        {
            console.error('Error initializing 3D letters:', error)
        }
    }

    setKiosk()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('kioskInteractivePoint')[0].position,
            'Map',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.modals.open('map')
                // interactivePoint.hide()
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // this.game.map.items.get('map').events.on('close', () =>
        // {
        //     interactivePoint.show()
        // })
    }

    setControls()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('controlsInteractivePoint')[0].position,
            'Controls',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.menu.open('controls')
                interactivePoint.hide()
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // Menu instance
        const menuInstance = this.game.menu.items.get('controls')

        menuInstance.events.on('close', () =>
        {
            interactivePoint.show()
        })

        menuInstance.events.on('open', () =>
        {
            if(this.game.inputs.mode === Inputs.MODE_GAMEPAD)
                menuInstance.tabs.goTo('gamepad')
            else if(this.game.inputs.mode === Inputs.MODE_MOUSEKEYBOARD)
                menuInstance.tabs.goTo('mouse-keyboard')
            else if(this.game.inputs.mode === Inputs.MODE_TOUCH)
                menuInstance.tabs.goTo('touch')
        })
    }

    setBonfire()
    {
        const position = this.references.items.get('bonfireHashes')[0].position

        // Particles
        let particles = null
        {
            const emissiveMaterial = this.game.materials.getFromName('emissiveOrangeRadialGradient')
    
            const count = 30
            const elevation = uniform(5)
            const positions = new Float32Array(count * 3)
            const scales = new Float32Array(count)
    
    
            for(let i = 0; i < count; i++)
            {
                const i3 = i * 3
    
                const angle = Math.PI * 2 * Math.random()
                const radius = Math.pow(Math.random(), 1.5) * 1
                positions[i3 + 0] = Math.cos(angle) * radius
                positions[i3 + 1] = Math.random()
                positions[i3 + 2] = Math.sin(angle) * radius
    
                scales[i] = 0.02 + Math.random() * 0.06
            }
            
            const positionAttribute = instancedArray(positions, 'vec3').toAttribute()
            const scaleAttribute = instancedArray(scales, 'float').toAttribute()
    
            const material = new THREE.SpriteNodeMaterial()
            material.outputNode = emissiveMaterial.outputNode
    
            const progress = float(0).toVar()
    
            material.positionNode = Fn(() =>
            {
                const newPosition = positionAttribute.toVar()
                progress.assign(newPosition.y.add(this.localTime.mul(newPosition.y)).fract())
    
                newPosition.y.assign(progress.mul(elevation))
                newPosition.xz.addAssign(this.game.wind.direction.mul(progress))
    
                const progressHide = step(0.8, progress).mul(100)
                newPosition.y.addAssign(progressHide)
                
                return newPosition
            })()
            material.scaleNode = Fn(() =>
            {
                const progressScale = progress.remapClamp(0.5, 1, 1, 0)
                return scaleAttribute.mul(progressScale)
            })()
    
            const geometry = new THREE.CircleGeometry(0.5, 8)
    
            particles = new THREE.Mesh(geometry, material)
            particles.visible = false
            particles.position.copy(position)
            particles.count = count
            this.game.scene.add(particles)
        }

        // Hashes
        {
            const alphaNode = Fn(() =>
            {
                const baseUv = uv(1)
                const distanceToCenter = baseUv.sub(0.5).length()
    
                const voronoi = texture(
                    this.game.noises.voronoi,
                    baseUv
                ).g
    
                voronoi.subAssign(distanceToCenter.remap(0, 0.5, 0.3, 0))
    
                return voronoi
            })()
    
            const material = new MeshDefaultMaterial({
                colorNode: color(0x6F6A87),
                alphaNode: alphaNode,
                hasWater: false,
                hasLightBounce: false
            })
    
            const mesh = this.references.items.get('bonfireHashes')[0]
            mesh.material = material
        }

        // Burn
        const burn = this.references.items.get('bonfireBurn')[0]
        burn.visible = false

        // Interactive point
        this.game.interactivePoints.create(
            this.references.items.get('bonfireInteractivePoint')[0].position,
            'Res(e)t',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.reset()

                gsap.delayedCall(2, () =>
                {
                    // Bonfire
                    particles.visible = true
                    burn.visible = true
                    this.game.ticker.wait(2, () =>
                    {
                        particles.geometry.boundingSphere.center.y = 2
                        particles.geometry.boundingSphere.radius = 2
                    })

                    // Sound
                    this.game.audio.groups.get('campfire').items[0].positions.push(position)
                })
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'landing')
        })
        this.events.on('boundingOut', () =>
        {
            this.game.achievements.setProgress('landingLeave', 1)
        })
    }

    update()
    {
        this.localTime.value += this.game.ticker.deltaScaled * 0.1
    }
}