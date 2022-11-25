import YoutubeAnnouncer from "./platforms/youtube-announcer.js"
import WasdAnnouncer from "./platforms/wasd-announcer.js"
import TrovoAnnouncer from "./platforms/trovo-announcer.js"
import TwitchAnnouncer from "./platforms/twitch-announcer.js"

import {Client} from "discord.js"
import {discord_intents as intents} from "./constants.js"

export default class AnnouncerBot {
    constructor() {
        this.platforms = [
            new YoutubeAnnouncer(),
            new WasdAnnouncer(),
            new TrovoAnnouncer(),
            new TwitchAnnouncer()
        ]
        
        this.main = this.main.bind(this)
    }
    
    async main() {
        console.log('Initialization')
        for (let platform of this.platforms) {
            platform.runQueue(this.client)
        }
    }
    
    init() {
        const apiKey = process.env.DISCORD_API_KEY
        if (!apiKey) {
            console.error('api key not specified')
        }
        
        this.client = new Client({intents, disableEveryone: false})
        this.client.login(apiKey)
            .then(this.main)
            .catch(this.error)
    }
    
    error(...args) {
        console.log(...args)
    }
}