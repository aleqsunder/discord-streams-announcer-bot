import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"

const goodGameChannelName = process.env.GOODGAME_CHANNEL_NAME
const GOODGAME_STATUS_LIVE = 'Live'

export default class GoodGameAnnouncer extends BaseAnnouncer {
    platformName = 'GOODGAME'
    platformLogo = 'https://static.goodgame.ru/images/favicon/apple-icon-76x76.png'
    platformLink = 'https://goodgame.ru/channel/'
    platformColor = 0x233056
    channelName = goodGameChannelName
    
    async checkStream() {
        const link = `https://goodgame.ru/api/getchannelstatus?id=${this.channelName}&fmt=json`
        
        try {
            const data = await this.getData(link)
            if (data instanceof Array) {
                return this.log(INFO_NOT_FOUND)
            }
            
            const [result = {}] = Object.values(data)
            const {stream_id = 0, status = false, title = '', thumb: preview = ''} = result
            
            if (status !== GOODGAME_STATUS_LIVE) {
                this.queue = []
                return this.log(STREAMER_OFFLINE)
            }
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            this.queue.push(stream_id)
            this.sendMessage({
                title,
                preview: `https:${preview}`
            }, stream_id)
        } catch (error) {
            console.error(error)
        }
    }
}