import fetch from "node-fetch"
import {trovo_timeout, webhook_user} from "./constants.js"
import {MessageEmbed} from "discord.js"
import BaseAnnouncer from "./base-announcer.js"
import {trovo_logo as iconURL} from "./constants.js"

const discordChannelId = process.env.DISCORD_CHANNEL_ID
const trovoChannelName = process.env.TROVO_CHANNEL_NAME

export default class TrovoAnnouncer extends BaseAnnouncer {
    async checkStream() {
        console.log('[trovo] Trying to get a status of channel ' + trovoChannelName)
        const trovoLink = `https://api-web.trovo.live/graphql?qid=0`
        const body = JSON.stringify([{
            operationName: "live_LiveReaderService_GetLiveInfo",
            variables: {
                params: {
                    userName: trovoChannelName,
                    requireDecorations: true
                }
            }
        }])
        const response = await fetch(trovoLink, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-store',
            body
        })
        const textRaw = await response.text()
        try {
            /** @param {result: {data: {live_LiveReaderService_GetLiveInfo: Object}}} result */
            const [result] = JSON.parse(textRaw)
            if (result.data?.live_LiveReaderService_GetLiveInfo) {
                const {data: {live_LiveReaderService_GetLiveInfo: info = {}} = {}} = result
                const {isLive = false, programInfo = {}} = info
                const {id: stream_id = 0} = programInfo
                if (!isLive) {
                    return console.log('[trovo] Streamer offline')
                }
    
                if (!this.queue.includes(stream_id)) {
                    console.log(`[trovo] Video ${stream_id} found, trying to send a message to the channel ${discordChannelId}`)
                    this.queue.push(stream_id)
                    this.sendMessage(programInfo)
                } else {
                    console.log('[trovo] An alert has already been created about this stream, skip')
                }
            } else {
                console.log('[trovo] Streaming information not found')
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    sendMessage(programInfo) {
        const discordChannel = this.client.channels.cache.get(discordChannelId)
        if (discordChannel) {
            const {title, coverUrl: preview} = programInfo
        
            const link = 'https://trovo.live/s/' + trovoChannelName
            const {name, avatar} = webhook_user
            const embed = new MessageEmbed()
                .setTitle(title)
                .setAuthor({
                    name: `${trovoChannelName}`,
                    url: link
                })
                .setColor('#1cbc73')
                .setURL(link)
                .setImage(preview)
                .setFooter({
                    iconURL,
                    text: 'Стрим на Trovo'
                })
        
            discordChannel.createWebhook(name, {avatar})
                .then(async context => {
                    console.log('[trovo] Sending a message')
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
        if (!trovoChannelName) {
            return console.error('[trovo] You didn\'t fill in the channel name')
        }
        
        await this.checkStream()
        setInterval(this.checkStream, trovo_timeout)
    }
}
