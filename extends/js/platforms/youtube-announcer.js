import fetch from "node-fetch"
import {
    default_headers as headers,
    youtube_logo as iconURL,
    webhook_user,
    youtube_timeout_limit
} from "../constants.js"
import {MessageEmbed} from "discord.js"
import {convertApiKeys} from "../helpers.js"
import BaseAnnouncer from "../base-announcer.js"

const youtubeChannelID = process.env.YOUTUBE_STREAMER_ID
const youtubeApiKeys = convertApiKeys(process.env.YOUTUBE_API_KEY)
const discordChannelId = process.env.DISCORD_CHANNEL_ID

export default class YoutubeAnnouncer extends BaseAnnouncer {
    async checkStream() {
        console.log('[youtube] Trying to get a list of user streams ' + youtubeChannelID)
        const currentTime = new Date()
        const interval = youtube_timeout_limit / youtubeApiKeys.length
        const currentSecondsInThisHour = (currentTime.getMinutes() * 60 + currentTime.getSeconds())
        const currentYoutubeApiKeyIndex = (currentSecondsInThisHour / (interval / 1000) ^ 0) % youtubeApiKeys.length
        const currentYoutubeApiKey = youtubeApiKeys[currentYoutubeApiKeyIndex]
        const youtubeLink = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${youtubeChannelID}&eventType=live&type=video&key=${currentYoutubeApiKey}`
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
                console.log(JSON.stringify(data))
                console.log('[youtube] New streams not found, waiting for the next iteration')
            }
        } catch (error) {
            console.error(error)
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
                .setFooter({
                    iconURL,
                    text: 'Стрим на Youtube'
                })
    
            discordChannel.createWebhook(name, {avatar})
                .then(async context => {
                    console.log('[youtube] Sending a message')
                    await context.send({
                        content: '@here',
                        embeds: [embed]
                    })
                    await context.delete()
                })
        }
    }
    
    async runQueue(_client) {
        this.client = _client
        if (!youtubeChannelID) {
            return console.error('[youtube] You didn\'t fill in the channel name')
        }
        if (!youtubeApiKeys || youtubeApiKeys.length === 0) {
            return console.error('[youtube] You didn\'t fill in the api keys')
        }
        
        const interval = youtube_timeout_limit / youtubeApiKeys.length
        await this.checkStream()
        setInterval(this.checkStream, interval)
    }
}
