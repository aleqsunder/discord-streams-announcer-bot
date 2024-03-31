import fetch from "node-fetch"
import {default_headers as headers} from "../constants.js"
import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, STREAMER_OFFLINE} from "../errors.js"

const vkPlayChannelName = process.env.VKPLAY_CHANNEL_NAME

export default class VkPlayAnnouncer extends BaseAnnouncer {
    platformName = 'VK PLAY'
    platformLogo = 'https://static.vkplay.live/static/favicon.png'
    platformLink = 'https://vkplay.live/'
    platformColor = 0x8e92de
    channelName = vkPlayChannelName
    
    async checkStream() {
        this.log(`Trying to get a list of user streams ${vkPlayChannelName}`)
        const vkPlayLink = `https://api.vkplay.live/v1/blog/${vkPlayChannelName}/public_video_stream`
        const response = await fetch(vkPlayLink, {
            headers,
            cache: 'no-store'
        })
        const textRaw = await response.text()
        try {
            const data = JSON.parse(textRaw)
            if (data.isOnline !== true) {
                return this.log(STREAMER_OFFLINE)
            }
            
            const {id: stream_id} = data
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            const {title, previewUrl: preview} = data
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
