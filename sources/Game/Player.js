import { Game } from './Game.js'
import gsap from 'gsap'
import { remapClamp, smallestAngle } from './utilities/maths.js'
import * as THREE from 'three/webgpu'
import { Inputs } from './Inputs/Inputs.js'
import { clamp } from 'three/src/math/MathUtils.js'

export class Player
{
    static STATE_DEFAULT = 1
    static STATE_LOCKED = 2

    constructor()
    {
        this.game = Game.getInstance()
        
        this.state = Player.STATE_DEFAULT
        this.accelerating = 0
        this.steering = 0
        this.boosting = 0
        this.braking = 0
        this.suspensions = ['low', 'low', 'low', 'low']

        const respawn = this.game.respawns.getDefault()

        this.position = respawn.position.clone()
        this.basePosition = this.position.clone()
        this.position2 = new THREE.Vector2(this.position.x, this.position.z)
        this.rotationY = 0

        this.setSounds()
        this.setInputs()
        this.setDistanceDriven()
        this.setUnstuck()
        // this.setBackWheel()
        this.setFlip()
        this.setTimePlayed()

        this.game.physicalVehicle.chassis.physical.initialState.position.x = respawn.position.x
        this.game.physicalVehicle.chassis.physical.initialState.position.y = respawn.position.y
        this.game.physicalVehicle.chassis.physical.initialState.position.z = respawn.position.z
        this.game.physicalVehicle.moveTo(respawn.position, respawn.rotation)

        this.game.ticker.events.on('tick', () =>
        {
            this.updatePrePhysics()
        }, 1)

        this.game.ticker.events.on('tick', () =>
        {
            this.updatePostPhysics()
        }, 6)
    }

    setSounds()
    {
        this.sounds = {}
        this.sounds.suspensions = this.game.audio.register({
            path: 'sounds/vehicle/suspensions/Robotic_Lifeforms_2_-_Air_Source_-_Piston_Studio_Chair_07.mp3',
            autoplay: false,
            loop: false,
            volume: 0,
            antiSpam: 0.1,
            onPlay: (item) =>
            {
                item.volume = 0
            }
        })
        this.sounds.honk = this.game.audio.register(
        {
            path: 'sounds/vehicle/honk/Car Horn Long 4.mp3',
            autoplay: true,
            loop: true,
            volume: 0,
            antiSpam: 0.1,
            onPlaying: (item) =>
            {
                item.volume = 0
            }
        })
        this.sounds.spring1 = this.game.audio.register({
            path: 'sounds/vehicle/springs/HandleSqueak_BW.60329.mp3',
            autoplay: false,
            loop: false,
            volume: 0,
            antiSpam: 1,
            onPlay: (item) =>
            {
                item.volume = 0
            }
        })
        this.sounds.spring2 = this.game.audio.register({
            path: 'sounds/vehicle/springs/SpringMetalMovements_1u54Y_01.mp3',
            autoplay: false,
            loop: false,
            volume: 0,
            antiSpam: 0.2,
            onPlay: (item) =>
            {
                item.volume = 0
            }
        })

        // Footsteps / floor ambience
        {
            // Default pebbles (footsteps on pavement/gravel)
            this.game.audio.register({
                group: 'wheelsOnFloor',
                path: 'sounds/vehicle/floor/wheels-on-pebbles-road.mp3',
                autoplay: true,
                loop: true,
                volume: 0,
                onPlaying: (item) =>
                {
                    const defaultElevation = 1.08
                    const inAirEffect = remapClamp(Math.abs(this.game.physicalVehicle.position.y - defaultElevation), 0, 2, 1, 0)
                    const speedEffect = Math.min(1, this.game.physicalVehicle.xzSpeed * 0.1)
                    item.volume = inAirEffect * speedEffect * 0.18
                }
            })

            // Brake pebbles
            this.game.audio.register({
                group: 'wheelsOnFloor',
                path: 'sounds/vehicle/floor/Source Stone Loop Small Rubbing Pebbles On Concrete 02.mp3',
                autoplay: true,
                loop: true,
                volume: 0,
                onPlaying: (item) =>
                {
                    item.volume = 0
                }
            })
        }

        // Engine and speed (Engine muted for walking avatar)
        {
            // Engine muted
            this.game.audio.register({
                path: 'sounds/vehicle/engine/muscle car engine loop idle.mp3',
                autoplay: true,
                loop: true,
                volume: 0,
                onPlaying: (item) =>
                {
                    item.volume = 0
                }
            })

            // Spin and wind
            this.game.audio.register({
                path: 'sounds/vehicle/spin/41051 Glass stone turning loop 09-full.mp3',
                autoplay: true,
                loop: true,
                volume: 0,
                onPlaying: (item) =>
                {
                    const speedEffect = clamp(this.game.physicalVehicle.xzSpeed * 0.1, 0, 1)
                    const volume = speedEffect * 0.3
                    const delta = volume - item.volume
                    const easing = delta > 0 ? 10 : 2.5
                    
                    item.volume += delta * this.game.ticker.deltaScaled * easing

                    const rate = remapClamp(speedEffect, 0, 1, 1, 2)
                    item.rate += (rate - item.rate) * this.game.ticker.deltaScaled * 5
                }
            })
        }

        // Boost
        this.game.audio.register({
            path: 'sounds/vehicle/energy/Energy_-_force_field_8_loop.mp3',
            autoplay: true,
            loop: true,
            volume: 0,
            onPlaying: (item) =>
            {
                const accelerating = 0.5 + Math.abs(this.game.player.accelerating) * 0.5
                const boosting = this.game.player.boosting
                const volume = accelerating * boosting * 0.3
                const delta = volume - item.volume
                const easing = delta > 0 ? 10 : 1
                
                item.volume += delta * this.game.ticker.deltaScaled * easing

                const rate = 0.95 + Math.abs(this.game.player.accelerating) * 2
                item.rate += (rate - item.rate) * this.game.ticker.deltaScaled * 5
            }
        })
    }

    setInputs()
    {
        this.game.inputs.addActions([
            { name: 'forward',               categories: [ 'wandering', 'racing', 'cinematic' ], keys: [ 'Keyboard.ArrowUp', 'Keyboard.KeyW', 'Gamepad.up', 'Gamepad.r2' ] },
            { name: 'right',                 categories: [ 'wandering', 'racing', 'cinematic' ], keys: [ 'Keyboard.ArrowRight', 'Keyboard.KeyD', 'Gamepad.right' ] },
            { name: 'backward',              categories: [ 'wandering', 'racing', 'cinematic' ], keys: [ 'Keyboard.ArrowDown', 'Keyboard.KeyS', 'Gamepad.down', 'Gamepad.l2' ] },
            { name: 'left',                  categories: [ 'wandering', 'racing', 'cinematic' ], keys: [ 'Keyboard.ArrowLeft', 'Keyboard.KeyA', 'Gamepad.left' ] },
            { name: 'boost',                 categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.ShiftLeft', 'Keyboard.ShiftRight', 'Gamepad.circle' ] },
            { name: 'brake',                 categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.KeyB', 'Keyboard.ControlLeft', 'Gamepad.square' ] },
            { name: 'respawn',               categories: [ 'wandering',                       ], keys: [ 'Keyboard.KeyR', 'Gamepad.select' ] },
            { name: 'suspensions',           categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad5', 'Keyboard.Space', 'Gamepad.triangle' ] },
            { name: 'suspensionsFront',      categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad8' ] },
            { name: 'suspensionsBack',       categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad2' ] },
            { name: 'suspensionsRight',      categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad6', 'Gamepad.r1' ] },
            { name: 'suspensionsLeft',       categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad4', 'Gamepad.l1' ] },
            { name: 'suspensionsFrontLeft',  categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad7', 'Keyboard.Digit2' ] },
            { name: 'suspensionsFrontRight', categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad9', 'Keyboard.Digit3' ] },
            { name: 'suspensionsBackRight',  categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad3', 'Keyboard.Digit4' ] },
            { name: 'suspensionsBackLeft',   categories: [ 'wandering', 'racing'              ], keys: [ 'Keyboard.Numpad1', 'Keyboard.Digit1' ] },
            { name: 'interact',              categories: [ 'wandering', 'racing', 'cinematic' ], keys: [ 'Keyboard.Enter', 'Keyboard.KeyE', 'Keyboard.KeyF', 'Gamepad.cross' ] },
            { name: 'honk',                  categories: [ 'wandering', 'racing', 'cinematic' ], keys: [ 'Keyboard.KeyH', 'Gamepad.l3' ] },
        ])

        // Respawn
        this.game.inputs.events.on('respawn', (action) =>
        {
            if(this.state !== Player.STATE_DEFAULT)
                return

            if(action.active)
            {
                this.respawn()
            }
        })

        // Honk
        this.game.inputs.events.on('honk', (action) =>
        {
            if(action.active)
                this.honk()
        })

        // Suspensions
        const suspensionsUpdate = () =>
        {
            if(this.state !== Player.STATE_DEFAULT)
                return

            const activeSuspensions = [
                this.game.inputs.actions.get('suspensions').active || this.game.inputs.actions.get('suspensionsFront').active || this.game.inputs.actions.get('suspensionsRight').active || this.game.inputs.actions.get('suspensionsFrontRight').active, // front right
                this.game.inputs.actions.get('suspensions').active || this.game.inputs.actions.get('suspensionsFront').active || this.game.inputs.actions.get('suspensionsLeft').active || this.game.inputs.actions.get('suspensionsFrontLeft').active, // front left
                this.game.inputs.actions.get('suspensions').active || this.game.inputs.actions.get('suspensionsBack').active || this.game.inputs.actions.get('suspensionsRight').active || this.game.inputs.actions.get('suspensionsBackRight').active, // back right
                this.game.inputs.actions.get('suspensions').active || this.game.inputs.actions.get('suspensionsBack').active || this.game.inputs.actions.get('suspensionsLeft').active || this.game.inputs.actions.get('suspensionsBackLeft').active, // back left
            ]

            const activeState = this.game.inputs.actions.get('suspensions').active ? 'high' : 'mid' // high = jump, mid = lowride

            for(let i = 0; i < 4; i++)
                this.suspensions[i] = activeSuspensions[i] ? activeState : 'low'

            const activeCount = activeSuspensions[0] + activeSuspensions[1] + activeSuspensions[2] + activeSuspensions[3]
            

            if(activeCount)
            {
                // Sound
                this.sounds.suspensions.play(activeCount)

                // Not a jump => Achievement
                if(!this.game.inputs.actions.get('suspensions').active)
                    this.game.achievements.addProgress('suspensions')
            }
                
        }

        this.game.inputs.events.on('suspensions', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsFront', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsBack', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsRight', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsLeft', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsFrontLeft', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsFrontRight', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsBackRight', suspensionsUpdate)
        this.game.inputs.events.on('suspensionsBackLeft', suspensionsUpdate)

        this.game.inputs.events.on('suspensions', () =>
        {
            if(this.game.inputs.mode === Inputs.MODE_TOUCH)
                this.game.inputs.nipple.jump()
        })

        // Nipple tap jump
        let nippleJumpTimeout = null
        this.game.inputs.nipple.events.on('tap', () =>
        {
            this.game.inputs.nipple.jump()

            for(let i = 0; i < 4; i++)
                this.suspensions[i] = 'high'

            if(nippleJumpTimeout)
                clearTimeout(nippleJumpTimeout)
            
            nippleJumpTimeout = setTimeout(() =>
            {
                for(let i = 0; i < 4; i++)
                    this.suspensions[i] = 'low'
            }, 200)
        })
    }

    setDistanceDriven()
    {
        this.distanceDriven = {}

        const localDistanceDriven = localStorage.getItem('distanceDriven')
        this.distanceDriven.value = localDistanceDriven ? parseInt(localDistanceDriven) : 0
        this.distanceDriven.floored = Math.floor(this.distanceDriven.value)
        this.distanceDriven.reset = () =>
        {
            localStorage.removeItem('distanceDriven')
            this.distanceDriven.value = 0
            this.distanceDriven.floored = 0
        }
        
    }

    setUnstuck()
    {
        this.unstuck = {}
        this.unstuck.duration = 3
        this.unstuck.delay = null

        this.game.physicalVehicle.events.on('rightSideUp', () =>
        {
            // Reset delay
            if(this.unstuck.delay)
                this.unstuck.delay.kill()
        })

        const waitAndTest = () =>
        {
            this.unstuck.delay = gsap.delayedCall(this.unstuck.duration, () =>
            {
                this.unstuck.delay = null

                if(this.state !== Player.STATE_DEFAULT)
                    return

                // Still upside down => Flip back
                if(this.game.physicalVehicle.upsideDown.active)
                {
                    this.game.physicalVehicle.flip.jump()
                    
                    // Sound
                    this.sounds.suspensions.play(4)

                    // Achievement
                    if(this.game.physicalVehicle.upsideDown.ratio > 0.75)
                        this.game.achievements.setProgress('upsideDown', 1)

                    // Again in case it didn't work
                    waitAndTest()
                }
            })
        }

        this.game.physicalVehicle.events.on('upsideDown', (ratio) =>
        {
            // Reset delay
            if(this.unstuck.delay)
                this.unstuck.delay.kill()

            // Wait a moment
            waitAndTest()
        })

        this.game.physicalVehicle.events.on('stuck', () =>
        {
            this.game.inputs.interactiveButtons.addItems(['unstuck'])
        })

        this.game.physicalVehicle.events.on('unstuck', () =>
        {
            this.game.inputs.interactiveButtons.removeItems(['unstuck'])
        })

        this.game.inputs.interactiveButtons.events.on('unstuck', () =>
        {
            this.game.inputs.interactiveButtons.removeItems(['unstuck'])
            this.respawn()
        })
    }

    // setBackWheel()
    // {
    //     let delay = null
    //     let startTime = null

    //     this.game.physicalVehicle.events.on('backWheel', (_active) =>
    //     {
    //         if(_active)
    //         {
    //             startTime = this.game.ticker.elapsed

    //             if(delay)
    //             {
    //                 delay.kill()
    //                 delay = null
    //             }
    //         }
    //         else
    //         {
    //             delay = gsap.delayedCall(0.1, () =>
    //             {
    //                 delay = null

    //                 const duration = this.game.ticker.elapsed - startTime

    //                 if(duration > 5)
    //                     this.game.achievements.setProgress('backWheel', 1)
    //             })
    //         }
    //     })
    // }

    setFlip()
    {
        this.game.physicalVehicle.events.on('flip', (direction) =>
        {
            if(direction > 0)
                this.game.achievements.setProgress('frontFlip', 1)
            else
                this.game.achievements.setProgress('backFlip', 1)
        })
    }

    setTimePlayed()
    {
        const localTimePlayed = localStorage.getItem('timePlayed')
        this.timePlayed = {}
        this.timePlayed.all = localTimePlayed ? parseFloat(localTimePlayed) : 0
        this.timePlayed.session = 0
        this.timePlayed.achieved = false

        setInterval(() =>
        {
            localStorage.setItem('timePlayed', this.timePlayed.all)
        }, 1000)
    }

    teleport(destinationName, callback = null)
    {
        // 1. Close any open areas cleanly
        if(this.game.world?.areas?.projects && this.game.world.areas.projects.state !== 5)
        {
            this.game.world.areas.projects.close()
        }
        if(this.game.world?.areas?.lab && this.game.world.areas.lab.state !== 5)
        {
            this.game.world.areas.lab.close()
        }

        // Close any modals or menus
        if(this.game.modals?.isOpen)
            this.game.modals.close()
        if(this.game.menu?.state === 2)
            this.game.menu.close()

        // 2. Clear cinematic view and reset input filters
        if(this.game.view?.cinematic)
        {
            this.game.view.cinematic.active = false
            this.game.view.cinematic.progress = 0
            if(this.game.rendering?.cheapDOFPass)
                this.game.rendering.cheapDOFPass.strength.value = 1.5
        }
        this.game.inputs.filters.delete('cinematic')
        this.game.inputs.filters.add('wandering')

        // 3. Find target respawn
        let respawn = this.game.respawns.getByName(destinationName)
        if(!respawn)
            respawn = this.game.respawns.getDefault()
        if(!respawn)
            return

        // 4. Force activate physics vehicle and move to target
        this.game.physicalVehicle.activate()
        this.game.physicalVehicle.moveTo(respawn.position, respawn.rotation)

        // 5. Instantly synchronize player coordinates & orientation
        this.position.copy(respawn.position)
        this.position2.set(respawn.position.x, respawn.position.z)
        this.rotationY = respawn.rotation
        this.state = Player.STATE_DEFAULT

        // 6. Instantly position Aditi girl avatar
        if(this.game.world?.visualVehicle)
        {
            this.game.world.visualVehicle.facingAngle = respawn.rotation
            if(this.game.world.visualVehicle.girl?.root)
            {
                this.game.world.visualVehicle.girl.root.position.set(
                    respawn.position.x,
                    respawn.position.y - 0.45,
                    respawn.position.z
                )
                this.game.world.visualVehicle.girl.root.rotation.y = respawn.rotation

                // Reset limbs to natural idle pose
                if(this.game.world.visualVehicle.girl.leftLeg)
                    this.game.world.visualVehicle.girl.leftLeg.rotation.x = 0
                if(this.game.world.visualVehicle.girl.rightLeg)
                    this.game.world.visualVehicle.girl.rightLeg.rotation.x = 0
                if(this.game.world.visualVehicle.girl.leftArm)
                    this.game.world.visualVehicle.girl.leftArm.rotation.x = 0
                if(this.game.world.visualVehicle.girl.rightArm)
                    this.game.world.visualVehicle.girl.rightArm.rotation.x = 0
            }
            if(this.game.world.visualVehicle.parts?.chassis)
            {
                this.game.world.visualVehicle.parts.chassis.position.copy(respawn.position)
            }
            if(typeof this.game.world.visualVehicle.pulseBeacon === 'function')
            {
                this.game.world.visualVehicle.pulseBeacon()
            }
        }

        // 7. Center camera and lock focus immediately on character
        if(this.game.view?.focusPoint)
        {
            this.game.view.focusPoint.isTracking = true
            this.game.view.focusPoint.trackedPosition.set(respawn.position.x, 0, respawn.position.z)
            this.game.view.focusPoint.position.set(respawn.position.x, 0, respawn.position.z)
            this.game.view.focusPoint.smoothedPosition.set(respawn.position.x, 0, respawn.position.z)
        }

        // 8. Focus canvas for immediate input response
        this.game.domElement.querySelector('.js-canvas')?.focus()

        if(typeof callback === 'function')
            callback()
    }

    respawn(respawnName = null, callback = null)
    {
        this.game.overlay.show(() =>
        {
            if(typeof callback === 'function')
                callback()

            // Find respawn
            let respawn = respawnName ? this.game.respawns.getByName(respawnName) : this.game.respawns.getClosest(this.position)

            if(!respawn)
                respawn = this.game.respawns.getDefault()

            // Update physical vehicle
            this.game.physicalVehicle.activate()
            this.game.physicalVehicle.moveTo(
                respawn.position,
                respawn.rotation
            )
            
            this.position.copy(respawn.position)
            this.position2.set(respawn.position.x, respawn.position.z)
            this.rotationY = respawn.rotation

            if(this.game.world?.visualVehicle)
            {
                this.game.world.visualVehicle.facingAngle = respawn.rotation
                if(this.game.world.visualVehicle.girl?.root)
                {
                    this.game.world.visualVehicle.girl.root.position.set(
                        respawn.position.x,
                        respawn.position.y - 0.45,
                        respawn.position.z
                    )
                    this.game.world.visualVehicle.girl.root.rotation.y = respawn.rotation
                }
                if(this.game.world.visualVehicle.parts?.chassis)
                {
                    this.game.world.visualVehicle.parts.chassis.position.copy(respawn.position)
                }
                if(typeof this.game.world.visualVehicle.pulseBeacon === 'function')
                {
                    this.game.world.visualVehicle.pulseBeacon()
                }
            }

            if(this.game.view?.focusPoint)
            {
                this.game.view.focusPoint.isTracking = true
                this.game.view.focusPoint.trackedPosition.set(respawn.position.x, 0, respawn.position.z)
                this.game.view.focusPoint.position.set(respawn.position.x, 0, respawn.position.z)
                this.game.view.focusPoint.smoothedPosition.set(respawn.position.x, 0, respawn.position.z)
            }

            this.state = Player.STATE_DEFAULT
            this.game.overlay.hide()
        })
    }

    die()
    {
        this.state = Player.STATE_LOCKED
        
        gsap.delayedCall(2, () =>
        {
            this.respawn(null, () =>
            {
                this.state = Player.STATE_DEFAULT
            })
        })
    }

    honk()
    {
        // Suspensions
        const randomWheelIndex = Math.floor(Math.random() * 4)
        const previousState = this.suspensions[randomWheelIndex]
        this.suspensions[ randomWheelIndex ] = 'mid'

        gsap.delayedCall(0.15, () =>
        {
            if(this.suspensions[ randomWheelIndex ] === 'mid')
            {
                this.suspensions[ randomWheelIndex ] = previousState
            }
        })

        // Achievement
        this.game.achievements.addProgress('honk')
    }

    updatePrePhysics()
    {
        this.accelerating = 0
        this.steering = 0
        this.boosting = 0
        this.braking = 0

        if(this.state !== Player.STATE_DEFAULT)
            return

        /**
         * Accelerating
         */
        if(this.game.inputs.actions.get('forward').active)
            this.accelerating += this.game.inputs.actions.get('forward').value

        if(this.game.inputs.actions.get('backward').active)
            this.accelerating -= this.game.inputs.actions.get('backward').value

        /**
         * Boosting
         */
        if(this.game.inputs.actions.get('boost').active)
            this.boosting = 1

        /**
         * Braking
         */
        if(this.game.inputs.actions.get('brake').active)
        {
            this.accelerating = 0
            this.braking = 1
        }

        /**
         * Steering
         */
        // Left / right actions
        if(this.game.inputs.actions.get('right').active)
            this.steering -= 1
        if(this.game.inputs.actions.get('left').active)
            this.steering += 1

        // Gamepad joystick
        if(this.steering === 0 && this.game.inputs.gamepad.joysticks.left.active)
            this.steering = - this.game.inputs.gamepad.joysticks.left.safeX

        /**
         * Nipple
         */
        if(this.game.inputs.nipple.active && this.game.inputs.nipple.progress > 0)
        {
            if(!this.game.view.focusPoint.isTracking)
            {
                // Wait a few frames in case it a multi-touch
                this.game.ticker.wait(5, () =>
                {
                    if(this.game.inputs.nipple.active)
                        this.game.view.focusPoint.isTracking = true
                })
            }
            this.accelerating = Math.pow(this.game.inputs.nipple.progress, 3)
            // this.boosting = this.game.inputs.nipple.progress > 0.999

            const angleDeltaAbs = Math.abs(this.game.inputs.nipple.smallestAngle)
            const angleDeltaAbsNormalized = angleDeltaAbs / ((Math.PI * 2 - this.game.inputs.nipple.forwardAmplitude) / 2)
            const angleDeltaSign = Math.sign(this.game.inputs.nipple.smallestAngle)
            const steering = - Math.min(angleDeltaAbsNormalized, 1) * angleDeltaSign

            this.steering = steering

            if(!this.game.inputs.nipple.forward)
            {
                this.accelerating *= -1
                this.steering *= -1
            }
        }

        /**
         * AR Hand Controller (Vision-Based Spatial Teleoperation)
         */
        if(this.game.arHandController && this.game.arHandController.active)
        {
            this.game.view.focusPoint.isTracking = true

            if(this.game.arHandController.braking)
            {
                this.accelerating = 0
                this.braking = 1
                this.steering = 0
            }
            else
            {
                if(this.game.arHandController.accelerating !== 0)
                    this.accelerating = this.game.arHandController.accelerating

                if(this.game.arHandController.steering !== 0)
                    this.steering = this.game.arHandController.steering

                if(this.game.arHandController.boosting)
                    this.boosting = 1
            }
        }
    }


    updatePostPhysics()
    {
        // Position
        this.position.copy(this.game.physicalVehicle.position)
        this.position2 = new THREE.Vector2(this.position.x, this.position.z)
        
        // View > Focus point
        this.game.view.focusPoint.trackedPosition.copy(this.position)

        // Keep camera centered on player during AR Hand Driving
        if(this.game.arHandController && this.game.arHandController.active)
        {
            this.game.view.focusPoint.isTracking = true
            const dist = Math.hypot(
                this.game.view.focusPoint.position.x - this.position.x,
                this.game.view.focusPoint.position.z - this.position.z
            )
            if(dist > 10)
            {
                this.game.view.focusPoint.position.x = this.position.x
                this.game.view.focusPoint.position.z = this.position.z
                this.game.view.focusPoint.smoothedPosition.x = this.position.x
                this.game.view.focusPoint.smoothedPosition.z = this.position.z
            }
        }


        // View > Speed lines
        if(this.boosting && this.accelerating && this.game.physicalVehicle.speed > 15)
            this.game.view.speedLines.strength = 1
        else
            this.game.view.speedLines.strength = 0

        this.game.view.speedLines.worldTarget.copy(this.position)

        // Tracks > Focus point
        this.game.tracks.focusPoint.set(this.position.x, this.position.z)

        // Inputs touch joystick
        this.rotationY = Math.atan2(this.game.physicalVehicle.forward.z, this.game.physicalVehicle.forward.x)
        this.game.inputs.nipple.setCoordinates(this.position.x, this.position.y, this.position.z, this.rotationY)

        // Sound
        if(this.game.physicalVehicle.wheels.justTouchedCount > 1)
        {
            this.sounds.spring1.play(this.game.physicalVehicle.wheels.justTouchedCount)
            this.sounds.spring2.play(this.game.physicalVehicle.wheels.justTouchedCount)
        }

        // Time played
        this.timePlayed.all += this.game.ticker.delta
        this.timePlayed.session += this.game.ticker.delta

        if(!this.timePlayed.achieved && this.timePlayed.session > this.game.dayCycles.duration)
        {
            this.timePlayed.achieved = true
            this.game.achievements.setProgress('fullDay', 1)
        }

        // Sea achievement
        const distanceToCenter = this.position2.length()
        if(distanceToCenter > 120)
            this.game.achievements.setProgress('sea', 1)

        // Go high achievements
        const elevation = Math.floor(this.position.y)
        if(this.game.achievements.groups.get('goHigh') && elevation > this.game.achievements.groups.get('goHigh').progress)
            this.game.achievements.setProgress('goHigh', elevation)

        // // Speed achievement
        // const speedKmPerHour = Math.floor(this.game.physicalVehicle.xzSpeed / 1000 * 3600)

        // if(this.game.achievements.groups.get('speed') && speedKmPerHour > this.game.achievements.groups.get('speed').progress)
        //     this.game.achievements.setProgress('speed', speedKmPerHour)

        // Distance driven
        this.distanceDriven.value += this.game.physicalVehicle.xzSpeed * this.game.ticker.deltaScaled
        const flooredDistanceDriven = Math.floor(this.distanceDriven.value)

        if(flooredDistanceDriven !== this.distanceDriven.floored)
        {
            localStorage.setItem('distanceDriven', flooredDistanceDriven)
            this.distanceDriven.floored = flooredDistanceDriven
        }
        
        // Achievement
        const distanceDrivenKm = Math.floor(this.distanceDriven.value / 1000)

        if(this.game.achievements.groups.get('distanceDriven') && distanceDrivenKm > this.game.achievements.groups.get('distanceDriven').progress)
        {
            this.game.achievements.setProgress('distanceDriven', distanceDrivenKm)

        }
    }
}