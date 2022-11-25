import fetch from "node-fetch"
import {NOTAUTHORIZED, UNEXPECTED} from "./constants.js"

export default class BaseAnnouncer {
    token = null
    
    constructor() {
        this.queue = []
        
        this.checkStream = this.checkStream.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }
    
    async checkStream() {}
    
    sendMessage() {}
    
    async runQueue(_client) {}
    
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
            console.log('[twitch] Session restored')
            this.token = access_token
            return true
        }
        
        console.log('[twitch] Invalid restored')
        return false
    }
}
