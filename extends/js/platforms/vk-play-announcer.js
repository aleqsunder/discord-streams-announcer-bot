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
        const link = `https://api.vkplay.live/v1/blog/${vkPlayChannelName}/public_video_stream`
        
        try {
            const {id: stream_id, isOnline: is_live = false, title, previewUrl: preview} = await this.getData(link)
            if (is_live !== true) {
                return this.log(STREAMER_OFFLINE)
            }
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
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
