import BaseAnnouncer from "../base-announcer.js"
import {NOTAUTHORIZED, SESSION_RESTORED, UNEXPECTED} from "../constants.js"
import fetch from "node-fetch"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, INVALID_SESSION_RESTORED, STREAMER_OFFLINE} from "../errors.js"

const twitchChannelName = process.env.TWITCH_CHANNEL_NAME

export default class TwitchAnnouncer extends BaseAnnouncer {
    platformName = 'Twitch'
    platformLogo = 'https://i.imgur.com/SJah69y.png'
    platformLink = 'https://www.twitch.tv/'
    platformColor = 0xa970ff
    channelName = twitchChannelName
    
    async checkStream() {
        this.log(`Trying to get a status of channel ${twitchChannelName}`)
        try {
            const userData = await this.getUser(twitchChannelName)
            if (userData.length === 0) {
                return this.log(INFO_NOT_FOUND)
            }
            
            const [user] = userData
            const {id: userId} = user
            const streamData = await this.getStreamInfo(userId)
            if (streamData.length === 0) {
                return this.log(STREAMER_OFFLINE)
            }
            
            const [stream] = streamData
            const {id: stream_id} = stream
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            const {title, thumbnail_url} = stream
            const preview = thumbnail_url
                .replace('{width}', 1600)
                .replace('{height}', 900)
    
            this.queue.push(stream_id)
            this.sendMessage({
                title,
                preview
            }, stream_id)
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
    
    get init () {
        return {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Client-ID': process.env.TWITCH_CLIENT_ID
            }
        }
    }
    
    async get(url) {
        const userResponse = await fetch(url, this.init)
        const {status = 200, data = []} = await userResponse.json()
        
        if (status === 401) {
            throw new Error(NOTAUTHORIZED)
        }
        
        switch (status) {
            case 200:
                return data
            case 401:
                throw new Error(NOTAUTHORIZED)
            default:
                throw new Error(UNEXPECTED)
        }
    }
    
    async getUser(name) {
        return await this.get('https://api.twitch.tv/helix/users?login=' + name)
    }
    
    async getStreamInfo(userId) {
        return await this.get('https://api.twitch.tv/helix/streams?user_id=' + userId)
    }
    
    async authorize() {
        const clientId = `client_id=${process.env.TWITCH_CLIENT_ID}`
        const clientSecret = `client_secret=${process.env.TWITCH_CLIENT_SECRET}`
        
        const response = await fetch(`https://id.twitch.tv/oauth2/token?${clientId}&${clientSecret}&grant_type=client_credentials`, {
            method: 'post'
        })
        const result = await response.json()
        const {access_token = null} = result
        if (access_token) {
            this.log(SESSION_RESTORED)
            this.token = access_token
            return true
        }
        
        this.log(INVALID_SESSION_RESTORED)
        return false
    }
}