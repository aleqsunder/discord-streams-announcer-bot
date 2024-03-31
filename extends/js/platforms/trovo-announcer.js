import fetch from "node-fetch"
import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"

const trovoChannelName = process.env.TROVO_CHANNEL_NAME

export default class TrovoAnnouncer extends BaseAnnouncer {
    platformName = 'Trovo'
    platformLogo = 'https://i.imgur.com/17ZhzQa.png'
    platformLink = 'https://trovo.live/s/'
    platformColor = 0x1cbc73
    channelName = trovoChannelName
    
    async checkStream() {
        this.log(`Trying to get a status of channel ${this.channelName}`)
        const trovoLink = `https://api-web.trovo.live/graphql?qid=0`
        const body = JSON.stringify([{
            operationName: "live_LiveReaderService_GetLiveInfo",
            variables: {
                params: {
                    userName: this.channelName,
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
            if (!result.data?.live_LiveReaderService_GetLiveInfo) {
                return this.log(INFO_NOT_FOUND)
            }
            
            const {data: {live_LiveReaderService_GetLiveInfo: info = {}} = {}} = result
            const {isLive = false, programInfo = {}} = info
            const {id: stream_id = 0} = programInfo
    
            if (!isLive) {
                return this.log(STREAMER_OFFLINE)
            }
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
    
            this.queue.push(stream_id)
            this.sendMessage({
                title: programInfo.title,
                preview: programInfo.coverUrl
            }, stream_id)
        } catch (error) {
            console.error(error)
        }
    }
}
