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

        // Step 0: Start screen & click-to-start ready
        if(step === 0)
        {
            // Transition HTML start overlay from loading state to ready state
            const loadingEl = document.getElementById('startLoading')
            const startBtn = document.getElementById('startBtn')
            const startHint = document.getElementById('startHint')
            if(loadingEl) loadingEl.style.display = 'none'
            if(startBtn) startBtn.style.display = 'inline-flex'
            if(startHint) startHint.style.display = 'block'

            // Position 3D intro camera and reveal ring
            this.distance.value = 0

            this.game.view.zoom.smoothedRatio = 0.65
            this.game.view.zoom.baseRatio = 0.65

            gsap.to(
                this.game.view.zoom,
                {
                    baseRatio: 0.35,
                    ease: 'power1.inOut',
                    duration: 1.25 / speedMultiplier,
                    overwrite: true,
                }
            )

            gsap.to(
                this.distance,
                {
                    value: 3.5,
                    ease: 'back.out(1.7)',
                    duration: 1.5 / speedMultiplier,
                    overwrite: true,
                }
            )

            if(this.game.world?.grid?.show)
                this.game.world.grid.show()

            if(this.game.world?.intro?.setText)
            {
                try
                {
                    this.game.world.intro.setText()
                    this.game.world.intro.setSoundButton()
                    this.game.ticker.wait(0.5, () =>
                    {
                        if(this.game.world?.intro?.showLabel)
                            this.game.world.intro.showLabel()
                    })
                }
                catch(e)
                {
                    console.warn('Intro 3D label catch:', e)
                }
            }

            if(this.game.world?.cherryTrees?.leaves)
                this.game.world.cherryTrees.leaves.seeThroughMultiplier = 0.5

            if(location.hash.match(/skip/i))
            {
                this.updateStep(1)
            }
            else
            {
                let started = false
                const next = () =>
                {
                    if(started) return
                    started = true

                    // Smoothly fade out Start Screen
                    const startScreen = document.getElementById('startScreen')
                    if(startScreen)
                    {
                        startScreen.classList.add('is-hidden')
                        setTimeout(() => startScreen.remove(), 700)
                    }

                    // Advance to step 1 (reveal wave + camera zoom)
                    this.updateStep(1)

                    // Cleanup listeners
                    window.removeEventListener('pointerdown', next)
                    window.removeEventListener('keydown', keyCallback)
                    this.game.inputs.events.off('introStart', next)
                    if(intersect)
                        this.game.rayCursor.removeIntersect(intersect)
                }

                const keyCallback = (event) =>
                {
                    next()
                }

                // Click start button or anywhere on screen
                if(startBtn)
                    startBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); }, { once: true })

                window.addEventListener('pointerdown', next, { once: true })
                window.addEventListener('keydown', keyCallback, { once: true })

                // 3D sphere ray intersect
                const position = this.position.clone()
                position.y = 0
                const intersect = this.game.rayCursor.addIntersect({
                    active: true,
                    shape: new THREE.Sphere(position, 4),
                    onClick: next
                })

                // Gamepad & keyboard actions
                this.game.inputs.addActions([
                    { name: 'introStart', categories: [ 'intro' ], keys: [ 'Gamepad.cross', 'Keyboard.Enter', 'Keyboard.Space', 'Keyboard.ArrowUp', 'Keyboard.ArrowDown', 'Keyboard.KeyW', 'Keyboard.KeyD' ] },
                ])
                this.game.inputs.events.on('introStart', next)
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