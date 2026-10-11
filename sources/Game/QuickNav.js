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
                    if(this.game.modals.isOpen && this.game.modals.current?.name === 'map')
                        this.game.modals.close()
                    else
                        this.game.modals.open('map')
                    return
                }

                // Close any open modals/menus
                if(this.game.modals?.isOpen)
                    this.game.modals.close()
                if(this.game.menu?.state === 2) // Menu.OPEN
                    this.game.menu.close()

                // Highlight active button
                for(const b of this.buttons)
                    b.classList.remove('is-active')
                button.classList.add('is-active')

                // Teleport / Respawn player
                this.game.player.respawn(destination, () =>
                {
                    // Focus canvas / inputs
                    this.game.domElement.querySelector('.js-canvas')?.focus()
                })
            })
        }
    }
}
