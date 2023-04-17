import fetch from "node-fetch"
import {default_headers as headers, youtube_timeout_limit} from "../constants.js"
import {convertApiKeys} from "../helpers.js"
import BaseAnnouncer from "../base-announcer.js"

const youtubeChannelID = process.env.YOUTUBE_STREAMER_ID
const youtubeApiKeys = convertApiKeys(process.env.YOUTUBE_API_KEY)

export default class YoutubeAnnouncer extends BaseAnnouncer {
    platformName = 'Youtube'
    platformLogo = 'https://i.imgur.com/S4DsV5h.png'
    platformLink = 'https://youtu.be/'
    platformColor = '#ff0000'
    channelName = youtubeChannelID
    interval = youtube_timeout_limit
    
    async checkStream() {
        this.log(`Trying to get a list of user streams ${this.channelName}`)
        const currentTime = new Date()
        const interval = this.interval / youtubeApiKeys.length
        const currentSecondsInThisHour = (currentTime.getMinutes() * 60 + currentTime.getSeconds())
        const currentYoutubeApiKeyIndex = (currentSecondsInThisHour / (interval / 1000) ^ 0) % youtubeApiKeys.length
        const currentYoutubeApiKey = youtubeApiKeys[currentYoutubeApiKeyIndex]
        const youtubeLink = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.channelName}&eventType=live&type=video&key=${currentYoutubeApiKey}`
        const response = await fetch(youtubeLink, {
            headers,
            cache: 'no-store'
        })
        const textRaw = await response.text()
        try {
            const data = JSON.parse(textRaw)
            if (data && data.items && data.items.length > 0) {
                const [item] = data.items
                if (item.id && item.id.videoId) {
                    if (!this.queue.includes(item.id.videoId)) {
                        const {snippet, id: {videoId}} = item
                        const {channelTitle, title} = snippet
                        const preview = snippet.thumbnails.high.url
                        const stream_id = item.id.videoId
                        
                        this.channelNameFormat = channelTitle
                        this.queue.push(stream_id)
                        this.sendMessage({
                            title,
                            preview,
                            videoId
                        }, stream_id)
                    } else {
                        this.log('An alert has already been created about this stream, skip')
                    }
                } else {
                    this.log('Video id not found, skip')
                }
            } else {
                console.log(JSON.stringify(data))
                this.log('New streams not found, waiting for the next iteration')
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    async runQueue(_client) {
        this.client = _client
        if (!this.channelName) {
            return console.error('[youtube] You didn\'t fill in the channel name')
        }
        if (!youtubeApiKeys || youtubeApiKeys.length === 0) {
            return console.error('[youtube] You didn\'t fill in the api keys')
        }
        
        const interval = this.interval / youtubeApiKeys.length
        await this.checkStream()
        setInterval(this.checkStream, interval)
    }
}
