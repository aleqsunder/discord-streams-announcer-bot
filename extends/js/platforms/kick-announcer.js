import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, STREAMER_OFFLINE} from "../errors.js"
import {KickApiWrapper} from "kick.com-api"
import {kick_timeout_limit} from "../constants.js"

const kickChannelName = process.env.KICK_CHANNEL_NAME

export default class KickAnnouncer extends BaseAnnouncer {
    platformName = 'Kick'
    platformLogo = 'https://i.imgur.com/rpTKwrq.png'
    platformLink = 'https://kick.com/'
    platformColor = 0x53fc18
    channelName = kickChannelName
    interval = kick_timeout_limit
    
    async checkStream() {
        try {
            const {livestream} = await this.getData()
            if (!livestream) {
                return this.log(STREAMER_OFFLINE)
            }

            const {id: stream_id = 0, session_title: title = '', thumbnail: {url: preview = ''} = {}} = livestream
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }

            this.queue.push(stream_id)
            this.sendMessage({title, preview}, stream_id)
        } catch (error) {
            return this.log(error)
        }
    }
    
    async getData() {
        this.log(`Get a stream info ${this.channelNameFormat ?? this.channelName}`)
        
        const kickApi = new KickApiWrapper({
            puppeteer: {
                args: ['--no-sandbox']
            }
        })
        
        return await kickApi.fetchChannelData(this.channelName)
    }
}