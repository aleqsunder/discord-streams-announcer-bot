import BaseAnnouncer from "../base-announcer.js"
import fetch from "node-fetch"
import {default_headers as headers} from "../constants.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"

const GOODGAME_CHANNEL_NAME = process.env.GOODGAME_CHANNEL_NAME
const GOODGAME_STATUS_LIVE = 'Live'

export default class GoodGameAnnouncer extends BaseAnnouncer {
    platformName = 'GOODGAME'
    platformLogo = 'https://static.goodgame.ru/images/favicon/apple-icon-76x76.png'
    platformLink = 'https://goodgame.ru/channel/'
    platformColor = 0x233056
    channelName = GOODGAME_CHANNEL_NAME
    
    async checkStream() {
        this.log(`Trying to get a status of channel ${this.channelName}`)
        const gglink = `https://goodgame.ru/api/getchannelstatus?id=${this.channelName}&fmt=json`
        const response = await fetch(gglink, {
            headers,
            cache: 'no-store'
        })
        const textRaw = await response.text()
        try {
            const data = JSON.parse(textRaw)
            if (data instanceof Array) {
                return this.log(INFO_NOT_FOUND)
            }
            
            const [result] = Object.values(data)
            if (!result?.stream_id) {
                return this.log(INFO_NOT_FOUND)
            }
            
            if (result?.status !== GOODGAME_STATUS_LIVE) {
                /**
                 * This platform does not have any unique identifiers that distinguish between a past or new broadcast,
                 * so if the status is not live, we simply clear the queue
                 *
                 * Данная платформа не имеет никаких уникальных идентификаторов, которые бы разграничивали прошедшую
                 * или новую трансляцию, так что если статус не live, то мы просто очищаем очередь
                 */
                this.queue = []
                return this.log(STREAMER_OFFLINE)
            }
            
            const {stream_id, title} = result
            const preview = `https://hls.goodgame.ru/previews/${stream_id}.jpg`
    
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            this.queue.push(stream_id)
            this.sendMessage({
                title,
                preview
            }, stream_id)
        } catch (error) {
            console.error(error)
        }
    }
}