import BaseAnnouncer from "../base-announcer.js"
import {
    NOTAUTHORIZED,
    UNEXPECTED,
    twitch_logo as iconURL,
    twitch_timeout,
    webhook_user
} from "../constants.js"
import {MessageEmbed} from "discord.js"

const discordChannelId = process.env.DISCORD_CHANNEL_ID
const twitchChannelName = process.env.TWITCH_CHANNEL_NAME

export default class TwitchAnnouncer extends BaseAnnouncer {
    async checkStream() {
        console.log('[twitch] Trying to get a status of channel ' + twitchChannelName)
        try {
            const userData = await this.getUser(twitchChannelName)
            if (userData.length > 0) {
                const [user] = userData
                const {id: userId} = user
                
                const streamData = await this.getStreamInfo(userId)
                if (streamData.length > 0) {
                    const [stream] = streamData
                    const {id: stream_id} = stream
                    
                    if (!this.queue.includes(stream_id)) {
                        console.log(`[twitch] Video ${stream_id} found, trying to send a message to the channel ${discordChannelId}`)
                        this.queue.push(stream_id)
                        this.sendMessage(stream)
                    } else {
                        console.log('[twitch] An alert has already been created about this stream, skip')
                    }
                } else {
                    console.log('[twitch] Streamer offline')
                }
            } else {
                console.log('[twitch] Streaming information not found')
            }
        } catch (e) {
            switch (e.message) {
                case NOTAUTHORIZED:
                    this.token = null
                    const result = await this.authorize()
                    if (result) {
                        await this.checkStream()
                    }
                    break
                case UNEXPECTED:
                default:
                    console.error(e)
            }
        }
    }
    
    sendMessage(stream) {
        const discordChannel = this.client.channels.cache.get(discordChannelId)
        if (discordChannel) {
            const {title, thumbnail_url} = stream
            const preview = thumbnail_url
                .replace('{width}', 1600)
                .replace('{height}', 900)
            
            const link = 'https://www.twitch.tv/' + twitchChannelName
            const {name, avatar} = webhook_user
            const embed = new MessageEmbed()
                .setTitle(title)
                .setAuthor({
                    name: `${twitchChannelName}`,
                    url: link
                })
                .setColor('#1cbc73')
                .setURL(link)
                .setImage(preview)
                .setFooter({
                    iconURL,
                    text: 'Стрим на Twitch'
                })
            
            discordChannel.createWebhook(name, {avatar})
                .then(async context => {
                    console.log('[twitch] Sending a message')
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
        if (!twitchChannelName) {
            return console.error('[twitch] You didn\'t fill in the channel name')
        }
        
        await this.checkStream()
        setInterval(this.checkStream, twitch_timeout)
    }
}