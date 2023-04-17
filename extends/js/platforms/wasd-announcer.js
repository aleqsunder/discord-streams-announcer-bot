import fetch from "node-fetch"
import {default_headers as headers} from "../constants.js"
import BaseAnnouncer from "../base-announcer.js"

const wasdChannelName = process.env.WASD_CHANNEL_NAME

export default class WasdAnnouncer extends BaseAnnouncer {
    platformName = 'WASD'
    platformLogo = 'https://i.imgur.com/nNwvbQp.png'
    platformLink = 'https://wasd.tv/'
    platformColor = '#00ff00'
    channelName = wasdChannelName
    
    async checkStream() {
        this.log(`Trying to get a list of user streams ${wasdChannelName}`)
        const wasdLink = `https://wasd.tv/api/v2/broadcasts/public?channel_name=${wasdChannelName}`
        const response = await fetch(wasdLink, {
            headers,
            cache: 'no-store'
        })
        const textRaw = await response.text()
        try {
            const data = JSON.parse(textRaw)
            if (data.result?.channel) {
                const {channel = null, media_container = null} = data.result
                if (channel && media_container && channel.channel_is_live === true) {
                    const [container] = media_container.media_container_streams
                    const {stream_id} = container
                    if (!this.queue.includes(stream_id)) {
                        const {media_container_name: title, media_container_streams: containers} = media_container
                        const [container] = containers
                        const [media] = container.stream_media
                        const {media_preview_images: {large: preview}} = media.media_meta
                        
                        this.queue.push(stream_id)
                        this.sendMessage({
                            title,
                            preview
                        }, stream_id)
                    } else {
                        this.log('An alert has already been created about this stream, skip')
                    }
                } else {
                    this.log('Video id not found, skip')
                }
            } else {
                this.log('New streams not found, waiting for the next iteration')
            }
        } catch (error) {
            console.error(error)
        }
    }
}
