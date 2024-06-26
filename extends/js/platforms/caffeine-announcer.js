import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"

const caffeineChannelName = process.env.CAFFEINE_CHANNEL_NAME

export default class CaffeineAnnouncer extends BaseAnnouncer {
    platformName = 'Caffeine'
    platformLogo = 'https://www.caffeine.tv/favicon-v3-32x32.png'
    platformLink = 'https://www.caffeine.tv/'
    platformColor = 0x0000ff
    channelName = caffeineChannelName
    
    async checkStream() {
        const link = `https://api.caffeine.tv/social/public/${caffeineChannelName}/featured`
        
        try {
            const data = await this.getData(link)
            const {broadcast_info: info = {}, is_live = false} = data
            const {broadcast_id: stream_id = null} = info
            
            if (is_live !== true || stream_id === null) {
                return this.log(STREAMER_OFFLINE)
            }
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            const {broadcast_title: title, preview_image_path: previewChunk} = info
            const preview = 'https://api-sam.caffeine.tv/thumb' + previewChunk
            
            this.queue.push(stream_id)
            this.sendMessage({
                title,
                preview
            }, stream_id)
        } catch (error) {
            return this.log(INFO_NOT_FOUND)
        }
    }
}
