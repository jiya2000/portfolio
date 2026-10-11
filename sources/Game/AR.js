import { Game } from './Game.js'

export class AR
{
    constructor()
    {
        this.game = Game.getInstance()
        this.modalElement = document.querySelector('.js-modal.ar-modal')
        this.modelViewer = document.querySelector('#aditi-ar-viewer')
        this.qrContainer = document.querySelector('.js-ar-qr-container')
        this.copyLinkBtn = document.querySelector('.js-ar-copy-link')
        this.statusText = document.querySelector('.js-ar-status')

        this.initQR()
        this.initListeners()
        this.checkURLHash()
    }

    initQR()
    {
        if(!this.qrContainer)
            return

        const url = `${window.location.origin}${window.location.pathname}#ar`
        const encodedUrl = encodeURIComponent(url)
        
        this.qrContainer.innerHTML = `
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&margin=0" alt="Scan QR Code to view Aditi in AR" class="qr-img">
        `

        if(this.copyLinkBtn)
        {
            this.copyLinkBtn.addEventListener('click', (e) =>
            {
                e.preventDefault()
                if(navigator.clipboard && navigator.clipboard.writeText)
                {
                    navigator.clipboard.writeText(url).then(() => {
                        this.showStatus('Copied AR link to clipboard!')
                    })
                }
                else
                {
                    this.showStatus('URL: ' + url)
                }
            })
        }
    }

    showStatus(msg)
    {
        if(!this.statusText)
            return
        this.statusText.textContent = msg
        this.statusText.classList.add('is-active')
        setTimeout(() => {
            this.statusText.textContent = ''
            this.statusText.classList.remove('is-active')
        }, 3000)
    }

    initListeners()
    {
        if(this.modelViewer)
        {
            this.modelViewer.addEventListener('ar-status', (event) =>
            {
                if(event.detail.status === 'session-started')
                {
                    if(this.game.notifications)
                        this.game.notifications.add('Augmented Reality active', 'ar')
                }
            })
        }

        const directLaunchBtn = document.querySelector('.js-ar-direct-launch')
        if(directLaunchBtn)
        {
            directLaunchBtn.addEventListener('click', () =>
            {
                if(this.modelViewer && typeof this.modelViewer.activateAR === 'function')
                {
                    this.modelViewer.activateAR()
                }
            })
        }
    }

    checkURLHash()
    {
        if(window.location.hash.match(/#ar/i))
        {
            setTimeout(() => {
                this.open()
            }, 800)
        }
    }

    open()
    {
        if(this.game.modals)
        {
            this.game.modals.open('ar')
        }
    }

    close()
    {
        if(this.game.modals)
        {
            this.game.modals.close()
        }
    }

    toggle()
    {
        if(this.game.modals?.isOpen && this.game.modals?.current?.name === 'ar')
            this.close()
        else
            this.open()
    }
}
