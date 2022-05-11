import fetch from 'node-fetch'
import {Client, MessageEmbed} from 'discord.js'
import {
    api_path,
    discord_intents as intents,
    default_headers as headers,
    default_timeout,
    webhook_user
} from "./constants.js"

const youtubeChannelID = process.env.YOUTUBE_STREAMER_ID
const youtubeApiKey = process.env.YOUTUBE_API_KEY
const discordChannelId = process.env.DISCORD_CHANNEL_ID

export default class YoutubeAnnouncerBot {
    constructor(_apiKey = null) {
        if (_apiKey === null) {
            return console.error('api key not specified')
        }
        
        this.queue = []
        this.apiKey = _apiKey
        
        this.main = this.main.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.checkYoutubeStream = this.checkYoutubeStream.bind(this)
    }
    
    async checkYoutubeStream() {
        console.log('Trying to get a list of user streams ' + youtubeChannelID)
        const youtubeLink = `${api_path}/search?part=snippet&channelId=${youtubeChannelID}&eventType=live&type=video&key=${youtubeApiKey}`
        const response = await fetch(youtubeLink, {headers})
        const data = await response.json()
    
        if (data.items && data.items.length > 0) {
            const [item] = data.items
            if (item.id && item.id.videoId) {
                if (!this.queue.includes(item.id.videoId)) {
                    console.log(`Video ${item.id.videoId} found, trying to send a message to the channel ${discordChannelId}`)
                    this.queue.push(item.id.videoId)
                    this.sendMessage(item)
                } else {
                    console.log('An alert has already been created about this stream, skip')
                }
            } else {
                console.log('Video id not found, skip')
            }
        } else {
            console.log('New streams not found, waiting for the next iteration')
        }
    }
    
    sendMessage(streamData) {
        const channel = this.client.channels.cache.get(discordChannelId)
        if (channel) {
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
    
            channel.createWebhook(name, {avatar})
                .then(async context => {
                    console.log('Sending a message')
                    await context.send({
                        content: '@everyone',
                        embeds: [embed]
                    })
                    await context.delete()
                })
        }
    }
    
    async main() {
        console.log('Initialization')
        await this.checkYoutubeStream()
        setInterval(this.checkYoutubeStream, default_timeout)
    }
    
    init() {
        if (!this.apiKey) {
            console.error('api key not specified')
        }
        
        this.client = new Client({intents, disableEveryone: false})
        this.client.login(this.apiKey)
            .then(this.main)
            .catch(this.error)
    }
    
    error(...args) {
        console.log(...args)
    }
}