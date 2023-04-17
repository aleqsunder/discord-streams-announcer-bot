import {webhook_user} from "./constants.js"
import {MessageEmbed} from "discord.js"

const discordChannelId = process.env.DISCORD_CHANNEL_ID

export default class BaseAnnouncer {
    platformName = null
    platformLogo = null
    platformLink = null
    platformColor = '#000000'
    channelName = null
    channelNameFormat = null
    interval = 3e4
    token = null
    
    constructor() {
        this.queue = []
        
        this.checkStream = this.checkStream.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.log = this.log.bind(this)
    }
    
    async checkStream() {
        this.error('This method is not implemented')
    }
    
    sendMessage(data, stream_id) {
        this.log(`Video ${stream_id} found, trying to send a message to the channel ${discordChannelId}`)
        
        const discordChannel = this.client.channels.cache.get(discordChannelId)
        if (discordChannel) {
            const {title, preview, videoId = null} = data
            const {name, avatar} = webhook_user
            const link = this.platformLink + (videoId ?? this.channelName)
            const embed = new MessageEmbed()
                .setTitle(title)
                .setAuthor({
                    name: `${this.channelNameFormat ?? this.channelName}`,
                    url: link
                })
                .setColor(this.platformColor)
                .setURL(link)
                .setImage(preview)
                .setFooter({
                    iconURL: this.platformLogo,
                    text: `Стрим на ${this.platformName}`
                })
            
            discordChannel.createWebhook(name, {avatar})
                .then(async context => {
                    this.log(`Sending a message`)
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
        if (!this.channelName) {
            return this.error(`You didn\'t fill in the channel name`)
        }
        
        await this.checkStream()
        setInterval(this.checkStream, this.interval)
    }
    
    log(text) {
        console.log(`[${this.platformName}] ${text}`)
    }
    
    error(text) {
        console.error(`[${this.platformName}] ${text}`)
    }
}
