import fetch from "node-fetch"
import {
    default_headers as headers,
    wasd_logo as iconURL,
    wasd_timeout,
    webhook_user
} from "../constants.js"
import {MessageEmbed} from "discord.js"
import BaseAnnouncer from "../base-announcer.js"

const discordChannelId = process.env.DISCORD_CHANNEL_ID
const wasdChannelName = process.env.WASD_CHANNEL_NAME

export default class WasdAnnouncer extends BaseAnnouncer {
    async checkStream() {
        console.log('[wasd] Trying to get a list of user streams ' + wasdChannelName)
        const wasdLink = `https://wasd.tv/api/v2/broadcasts/public?channel_name=${wasdChannelName}`
        const response = await fetch(wasdLink, {
            headers,
            cache: 'no-store'
        })
        const textRaw = await response.text()
        try {
            const data = JSON.parse(textRaw)
            if (data.result?.channel) {
                const {channel = null, media_container = null} = data.result
                if (channel && media_container && channel.channel_is_live === true) {
                    const [container] = media_container.media_container_streams
                    const {stream_id} = container
                    if (!this.queue.includes(stream_id)) {
                        console.log(`[wasd] Video ${stream_id} found, trying to send a message to the channel ${discordChannelId}`)
                        this.queue.push(stream_id)
                        this.sendMessage(media_container)
                    } else {
                        console.log('[wasd] An alert has already been created about this stream, skip')
                    }
                } else {
                    console.log('[wasd] Video id not found, skip')
                }
            } else {
                console.log(JSON.stringify(data))
                console.log('[wasd] New streams not found, waiting for the next iteration')
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    sendMessage(media_container) {
        const discordChannel = this.client.channels.cache.get(discordChannelId)
        if (discordChannel) {
            const {media_container_name: title, media_container_streams: containers} = media_container
            const [container] = containers
            const [media] = container.stream_media
            const {media_preview_images: {large: preview}} = media.media_meta
    
            const link = 'https://wasd.tv/' + wasdChannelName
            const {name, avatar} = webhook_user
            const embed = new MessageEmbed()
                .setTitle(title)
                .setAuthor({
                    name: `${wasdChannelName}`,
                    url: link
                })
                .setColor('#0f0')
                .setURL(link)
                .setImage(preview)
                .setFooter({
                    iconURL,
                    text: 'Стрим на Trovo'
                })
    
            discordChannel.createWebhook(name, {avatar})
                .then(async context => {
                    console.log('[wasd] Sending a message')
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
        if (!wasdChannelName) {
            return console.error('[wasd] You didn\'t fill in the channel name')
        }
        
        await this.checkStream()
        setInterval(this.checkStream, wasd_timeout)
    }
}
