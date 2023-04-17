import list from './platforms/_list.js'

import {Client} from "discord.js"
import {discord_intents as intents} from "./constants.js"

export default class AnnouncerBot {
    constructor() {
        this.platforms = list
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