import * as THREE from 'three/webgpu'
import { color, uniform, vec2 } from 'three/tsl'
import { Game } from './Game.js'
import gsap from 'gsap'

export class Reveal
{
    constructor()
    {
        this.game = Game.getInstance()
        
        this.step = -1
        const respawn = this.game.respawns.getDefault()
        this.position = respawn.position.clone()
        this.position2Uniform = uniform(vec2(this.position.x, this.position.z))
        this.distance = uniform(0)
        this.thickness = uniform(0.05)
        this.color = uniform(color('#e88eff'))
        this.intensity = uniform(5.5)
        this.intensityMultiplier = 1
        this.sound = this.game.audio.register({
            path: 'sounds/reveal/reveal-1.mp3',
            autoplay: false,
            loop: false,
            volume: 0.5,
            preload: true
        })

        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '📜 Reveal',
                expanded: false,
            })

            this.debugPanel.addBinding(this.distance, 'value', { label: 'distance', min: 0, max: 20, step: 0.01 })
            this.debugPanel.addBinding(this.thickness, 'value', { label: 'thickness', min: 0, max: 1, step: 0.001 })
            // this.game.debug.addThreeColorBinding(this.debugPanel, this.color.value, 'color')
            this.debugPanel.addBinding(this.intensity, 'value', { label: 'intensity', min: 1, max: 20, step: 0.001 })
        }

        this.update = this.update.bind(this)
        this.game.ticker.events.on('tick', this.update, 10)
    }

    updateStep(step)
    {
        const speedMultiplier = location.hash.match(/skip/i) ? 4 : 1

        // Step 0: 3D intro screen (glowing circle, CLICK TO START arrow, and sound icon)
        if(step === 0)
        {
            const setupIntro = () =>
            {
                // Grid
                if(this.game.world?.grid?.show)
                    this.game.world.grid.show()

                // Reveal glowing circle around the character
                this.distance.value = 0

                gsap.to(
                    this.distance,
                    {
                        value: 3.5,
                        ease: 'back.out(1.7)',
                        duration: 1.8 / speedMultiplier,
                        overwrite: true,
                    }
                )

                // Isometric zoomed-out view
                this.game.view.zoom.smoothedRatio = 0.6
                this.game.view.zoom.baseRatio = 0.6

                gsap.to(
                    this.game.view.zoom,
                    {
                        baseRatio: 0.3,
                        ease: 'power1.inOut',
                        duration: 1.25 / speedMultiplier,
                        overwrite: true,
                    }
                )

                // 3D CLICK TO START label and speaker button
                if(this.game.world?.intro)
                {
                    try
                    {
                        this.game.world.intro.setText()
                        this.game.world.intro.setSoundButton()
                        this.game.world.intro.showLabel()
                    }
                    catch(e)
                    {
                        console.warn('Intro 3D label error:', e)
                    }
                }

                // Cherry trees see-through
                if(this.game.world?.cherryTrees?.leaves)
                    this.game.world.cherryTrees.leaves.seeThroughMultiplier = 0.5

                if(location.hash.match(/skip/i))
                {
                    this.updateStep(1)
                }
                else
                {
                    let nextTriggered = false
                    const next = () =>
                    {
                        if(nextTriggered) return
                        nextTriggered = true

                        // Advance to step 1 (reveal wave + camera swoop)
                        this.updateStep(1)

                        // Cleanup listeners
                        window.removeEventListener('pointerdown', pointerCallback)
                        window.removeEventListener('keydown', keyCallback)
                        this.game.inputs.events.off('introStart', next)
                        if(intersect)
                            this.game.rayCursor.removeIntersect(intersect)
                    }

                    const pointerCallback = (event) =>
                    {
                        // Don't advance if clicking on the sound toggle icon
                        if(this.game.world?.intro?.soundButton?.intersect?.isHovered)
                            return
                        next()
                    }

                    const keyCallback = (event) =>
                    {
                        next()
                    }

                    window.addEventListener('pointerdown', pointerCallback, { once: true })
                    window.addEventListener('keydown', keyCallback, { once: true })

                    // 3D sphere ray intersect on the glowing circle
                    const position = this.position.clone()
                    position.y = 0
                    const intersect = this.game.rayCursor.addIntersect({
                        active: true,
                        shape: new THREE.Sphere(position, 4),
                        onClick: next,
                        onEnter: () =>
                        {
                            gsap.to(this, { intensityMultiplier: 1.22, duration: 0.2, overwrite: true })
                        },
                        onLeave: () =>
                        {
                            gsap.to(this, { intensityMultiplier: 1, duration: 0.2, overwrite: true })
                        }
                    })

                    // Gamepad & keyboard actions
                    this.game.inputs.addActions([
                        { name: 'introStart', categories: [ 'intro' ], keys: [ 'Gamepad.cross', 'Keyboard.Enter', 'Keyboard.Space', 'Keyboard.ArrowUp', 'Keyboard.ArrowDown', 'Keyboard.KeyW', 'Keyboard.KeyD' ] },
                    ])
                    this.game.inputs.events.on('introStart', next)
                }
            }

            // Hide loading circle and setup intro scene
            if(this.game.world?.intro?.circle?.hide)
            {
                this.game.world.intro.circle.hide(setupIntro)
            }
            else
            {
                setupIntro()
            }
        }
        else if(step === 1)
        {
            // Audio
            try
            {
                this.game.audio.init()
                this.sound.play()
            }
            catch(e) {}

            // Reveal: smoothly open 3D world to reveal all areas
            gsap.to(
                this.distance,
                {
                    value: 40,
                    ease: 'power2.out',
                    duration: 1.25,
                    overwrite: true,
                    onComplete: () =>
                    {
                        this.distance.value = 99999
                    }
                }
            )

            // Intro loader => Hide label
            if(this.game.world?.intro?.hideLabel)
                this.game.world.intro.hideLabel()

            // Inputs => Immediately enable player locomotion and HUD
            this.game.inputs.filters.clear()
            this.game.inputs.filters.add('wandering')

            // View => Focus camera smoothly on Aditi
            this.game.view.focusPoint.isTracking = true
            this.game.view.focusPoint.magnet.active = false

            gsap.to(
                this.game.view.zoom,
                {
                    baseRatio: 0,
                    ease: 'power2.out',
                    duration: 1.25,
                    overwrite: true,
                    onComplete: () =>
                    {
                        this.updateStep(2)
                    }
                }
            )

            // Cherry trees
            if(this.game.world?.cherryTrees?.leaves)
            {
                gsap.to(
                    this.game.world.cherryTrees.leaves,
                    {
                        seeThroughMultiplier: 1,
                        ease: 'power1.inOut',
                        duration: 1.25,
                        overwrite: true
                    }
                )
            }
        }
        else if(step === 2)
        {
            this.game.interactivePoints.recover()
            
            this.game.world.step(2)
            this.game.world.grid.destroy()
            this.game.world.intro.destroy()
            this.game.world.intro = null

            this.game.overlay.moveOnTop()

            this.game.server.start()

            this.game.menu.preopen()

            this.game.ticker.events.off('tick', this.update)
        }

        this.step = step
    }

    update()
    {
        this.color.value.copy(this.game.dayCycles.properties.revealColor.value)
        this.intensity.value = this.game.dayCycles.properties.revealIntensity.value * this.intensityMultiplier
    }
}