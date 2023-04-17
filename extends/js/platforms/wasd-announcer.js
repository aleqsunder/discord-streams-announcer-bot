import fetch from "node-fetch"
import {default_headers as headers} from "../constants.js"
import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"

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
            if (!data.result?.channel) {
                return this.log(INFO_NOT_FOUND)
            }
            
            const {channel = null, media_container = null} = data.result
            if (!channel || !media_container || channel?.channel_is_live !== true) {
                return this.log(STREAMER_OFFLINE)
            }
            
            const [container] = media_container.media_container_streams
            const {stream_id} = container
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            const {media_container_name: title, media_container_streams: containers} = media_container
            const [containerItem] = containers
            const [media] = containerItem.stream_media
            const {media_preview_images: {large: preview}} = media.media_meta
    
            this.queue.push(stream_id)
            this.sendMessage({
                title,
                preview
            }, stream_id)
        } catch (error) {
            console.error(error)
        }
    }
}
