import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, STREAMER_OFFLINE} from "../errors.js"

const nuumChannelName = process.env.NUUM_CHANNEL_NAME

export default class NuumAnnouncer extends BaseAnnouncer {
    platformName = 'Nuum'
    platformLogo = 'https://nuum.ru/favicon.ico'
    platformLink = 'https://nuum.ru/channel/'
    platformColor = 0x633BF5
    channelName = nuumChannelName
    
    async checkStream() {
        const link = `https://nuum.ru/api/v2/broadcasts/public?channel_name=${this.channelName}`
        
        try {
            const {result: {channel = {}, media_container = {}}} = await this.getData(link)
            const {channel_is_live: is_live = false} = channel
            if (!is_live) {
                return this.log(STREAMER_OFFLINE)
            }
            
            const {media_container_streams: streams = [], media_container_name: title = ''} = media_container
            const [stream] = streams
            const {stream_id = 0, stream_media = {}} = stream
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            const [media] = stream_media
            const {media_meta: {media_preview_url: preview = ''}} = media
            
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
