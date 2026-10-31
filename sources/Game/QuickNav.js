import { Game } from './Game.js'

export class QuickNav
{
    constructor()
    {
        this.game = Game.getInstance()
        this.element = this.game.domElement.querySelector('.js-quick-nav')

        if(!this.element)
            return

        this.buttons = [...this.element.querySelectorAll('.nav-btn')]
        this.manualLock = false
        this.manualLockTimer = null

        this.setActive = (destination) =>
        {
            for(const b of this.buttons)
            {
                if(b.dataset.destination === destination)
                    b.classList.add('is-active')
                else
                    b.classList.remove('is-active')
            }
        }

        for(const button of this.buttons)
        {
            button.addEventListener('click', (event) =>
            {
                event.preventDefault()
                event.stopPropagation()

                const destination = button.dataset.destination

                // Sound
                const clickSound = this.game.audio?.groups?.get('click')
                if(clickSound)
                    clickSound.play(true)

                if(destination === 'map')
                {
                    if(this.game.modals.current?.isOpen && this.game.modals.current?.name === 'map')
                        this.game.modals.close()
                    else
                        this.game.modals.open('map')
                    return
                }

                if(destination === 'vr' || destination === 'ar')
                {
                    if(this.game.ar)
                        this.game.ar.toggle()
                    else if(this.game.modals)
                        this.game.modals.open('vr')
                    return
                }

                // Close any open modals/menus
                if(this.game.modals?.current?.isOpen)
                    this.game.modals.close()
                if(this.game.menu?.current?.isOpen)
                    this.game.menu.close()

                // Highlight active button immediately and lock for 3s
                this.setActive(destination)
                this.manualLock = true
                if(this.manualLockTimer)
                    clearTimeout(this.manualLockTimer)
                this.manualLockTimer = setTimeout(() => { this.manualLock = false }, 3500)

                // Teleport player and camera to destination
                this.game.player.teleport(destination, () =>
                {
                    this.game.domElement.querySelector('.js-canvas')?.focus()
                })
            })
        }

        // Keep active navigation button in sync with player's real world location
        let lastCheck = 0
        this.game.ticker.events.on('tick', () =>
        {
            if(this.manualLock || this.game.modals?.current?.isOpen)
                return

            if(this.game.ticker.elapsed - lastCheck < 0.4)
                return
            lastCheck = this.game.ticker.elapsed

            if(!this.game.player?.position)
                return

            const px = this.game.player.position.x
            const pz = this.game.player.position.z

            const landmarks = [
                { id: 'career', x: 26.0, z: -2.0, r: 15 },
                { id: 'social', x: 25.6, z: -16.5, r: 8 },
                { id: 'projects', x: 35.8, z: 17.5, r: 14 },
                { id: 'lab', x: 17.8, z: 18.8, r: 14 },
                { id: 'landing', x: 39.5, z: 37.8, r: 18 }
            ]

            let closestId = null
            let minDistance = Infinity

            for(const lm of landmarks)
            {
                const dist = Math.hypot(px - lm.x, pz - lm.z)
                if(dist < lm.r && dist < minDistance)
                {
                    minDistance = dist
                    closestId = lm.id
                }
            }

            if(closestId)
            {
                this.setActive(closestId)
            }
        })
    }
}

