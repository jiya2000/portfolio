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

    getVRUrl()
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

        const basePath = window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/$/, '')
        return `${origin}${basePath}/vr.html`
    }

    getARUrl()
    {
        return this.getVRUrl()
    }

    initQR()
    {
        const qrContainers = document.querySelectorAll('.js-vr-qr-container, .js-ar-qr-container')
        if(!qrContainers || qrContainers.length === 0)
            return

        const url = this.getVRUrl()
        const encodedUrl = encodeURIComponent(url)
        
        qrContainers.forEach(container => {
            container.innerHTML = `
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&margin=0" alt="Scan QR Code to view Aditi in VR" class="qr-img">
            `
        })

        const urlDisplays = document.querySelectorAll('.js-vr-url-display, .js-ar-url-display')
        urlDisplays.forEach(elem => {
            elem.textContent = url
        })

        const copyBtns = document.querySelectorAll('.js-vr-copy-link, .js-ar-copy-link')
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) =>
            {
                e.preventDefault()
                if(navigator.clipboard && navigator.clipboard.writeText)
                {
                    navigator.clipboard.writeText(url).then(() => {
                        this.showStatus('Copied VR link: ' + url)
                    })
                }
                else
                {
                    this.showStatus('URL: ' + url)
                }
            })
        })
    }

    showStatus(msg)
    {
        const statusElems = document.querySelectorAll('.js-vr-status, .js-ar-status')
        statusElems.forEach(elem => {
            elem.textContent = msg
            elem.classList.add('is-active')
            setTimeout(() => {
                elem.textContent = ''
                elem.classList.remove('is-active')
            }, 3000)
        })
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
                        this.game.notifications.add('Virtual Reality active', 'vr')
                }
            })
        }
    }

    checkURLHash()
    {
        if(window.location.hash.match(/#(vr|ar)/i))
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
            if(this.game.modals.items.has('vr'))
                this.game.modals.open('vr')
            else
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
        if(this.game.modals?.isOpen && (this.game.modals?.current?.name === 'vr' || this.game.modals?.current?.name === 'ar'))
            this.close()
        else
            this.open()
    }
}
