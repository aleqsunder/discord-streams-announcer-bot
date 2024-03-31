import fetch from "node-fetch"
import {default_headers as headers} from "../constants.js"
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
        this.log(`Trying to get a list of user streams ${caffeineChannelName}`)
        const caffeineLink = `https://api.caffeine.tv/social/public/${caffeineChannelName}/featured`
        const response = await fetch(caffeineLink, {
            headers,
            cache: 'no-store'
        })
        const textRaw = await response.text()
        try {
            const data = JSON.parse(textRaw)
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
