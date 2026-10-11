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

    getARUrl()
    {
        let origin = window.location.origin
        const hostname = window.location.hostname
        
        // When running on localhost or 127.0.0.1, mobile devices cannot resolve "localhost"
        // Use the local network IP provided by Vite define or fallback to current Mac Wi-Fi IP
        if(hostname === 'localhost' || hostname === '127.0.0.1')
        {
            const devIp = (typeof __DEV_NETWORK_IP__ !== 'undefined' && __DEV_NETWORK_IP__ && __DEV_NETWORK_IP__ !== 'localhost') 
                ? __DEV_NETWORK_IP__ 
                : '172.20.10.3'
            const port = window.location.port ? `:${window.location.port}` : ''
            origin = `${window.location.protocol}//${devIp}${port}`
        }

        return `${origin}${window.location.pathname}#ar`
    }

    initQR()
    {
        if(!this.qrContainer)
            return

        const url = this.getARUrl()
        const encodedUrl = encodeURIComponent(url)
        
        this.qrContainer.innerHTML = `
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&margin=0" alt="Scan QR Code to view Aditi in AR" class="qr-img">
        `

        const urlDisplay = document.querySelector('.js-ar-url-display')
        if(urlDisplay)
        {
            urlDisplay.textContent = url
        }

        if(this.copyLinkBtn)
        {
            this.copyLinkBtn.addEventListener('click', (e) =>
            {
                e.preventDefault()
                if(navigator.clipboard && navigator.clipboard.writeText)
                {
                    navigator.clipboard.writeText(url).then(() => {
                        this.showStatus('Copied AR link: ' + url)
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
