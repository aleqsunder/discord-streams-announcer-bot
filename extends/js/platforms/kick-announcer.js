import fetch from "node-fetch"
import {kick_timeout_limit} from "../constants.js"
import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"

const kickChannelName = process.env.KICK_CHANNEL_NAME

export default class KickAnnouncer extends BaseAnnouncer {
    platformName = 'Kick'
    platformLogo = 'https://i.imgur.com/rpTKwrq.png'
    platformLink = 'https://kick.com/'
    platformColor = '#53fc18'
    channelName = kickChannelName
    interval = kick_timeout_limit
    
    async checkStream() {
        this.log(`Trying to get a status of channel ${this.channelName}`)
        const kickLink = `https://kick.com/api/v2/channels/${this.channelName}`

        const response = await fetch(kickLink);
        const kicklive = await response.json();
        //console.log(movies);

        const {livestream} = kicklive

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
            return this.log(INFO_NOT_FOUND)
        }
}