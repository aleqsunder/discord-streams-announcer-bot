import fetch from "node-fetch"
import {default_headers as headers, webhook_user, youtube_timeout} from "./constants.js"
import {MessageEmbed} from "discord.js"

const youtubeChannelID = process.env.YOUTUBE_STREAMER_ID
const youtubeApiKey = process.env.YOUTUBE_API_KEY
const discordChannelId = process.env.DISCORD_CHANNEL_ID

export default class YoutubeAnnouncer {
    constructor() {
        this.queue = []
        
        this.checkStream = this.checkStream.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }
    
    async checkStream() {
        console.log('[youtube] Trying to get a list of user streams ' + youtubeChannelID)
        const youtubeLink = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${youtubeChannelID}&eventType=live&type=video&key=${youtubeApiKey}`
        const response = await fetch(youtubeLink, {
            headers,
            cache: 'no-store'
        })
        const data = await response.json()
        
        if (data && data.items && data.items.length > 0) {
            const [item] = data.items
            if (item.id && item.id.videoId) {
                if (!this.queue.includes(item.id.videoId)) {
                    console.log(`[youtube] Video ${item.id.videoId} found, trying to send a message to the channel ${discordChannelId}`)
                    this.queue.push(item.id.videoId)
                    this.sendMessage(item)
                } else {
                    console.log('[youtube] An alert has already been created about this stream, skip')
                }
            } else {
                console.log('[youtube] Video id not found, skip')
            }
        } else {
            console.log('[youtube] New streams not found, waiting for the next iteration')
        }
    }
    
    sendMessage(streamData) {
        const discordChannel = this.client.channels.cache.get(discordChannelId)
        if (discordChannel) {
            const {snippet, id: {videoId}} = streamData
            const {channelTitle, title} = snippet
            
            const link = 'https://youtu.be/' + videoId
            const {name, avatar} = webhook_user
            const embed = new MessageEmbed()
                .setTitle(title)
                .setAuthor({
                    name: `${channelTitle}`,
                    url: link
                })
                .setColor('#f00')
                .setURL(link)
                .setImage(snippet.thumbnails.high.url)
    
            discordChannel.createWebhook(name, {avatar})
                .then(async context => {
                    console.log('[youtube] Sending a message')
                    await context.send({
                        content: '@everyone',
                        embeds: [embed]
                    })
                    await context.delete()
                })
        }
    }
    
    async runQueue(_client) {
        this.client = _client
        if (!youtubeChannelID) {
            console.error('[youtube] You didn\'t fill in the channel name')
        }
        
        await this.checkStream()
        setTimeout(this.checkStream, youtube_timeout)
    }
}