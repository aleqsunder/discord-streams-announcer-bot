import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"
import puppeteer from "puppeteer-extra"
import {executablePath} from "puppeteer"

const kickChannelName = process.env.KICK_CHANNEL_NAME

export default class KickAnnouncer extends BaseAnnouncer {
    platformName = 'Kick'
    platformLogo = 'https://i.imgur.com/rpTKwrq.png'
    platformLink = 'https://kick.com/'
    platformColor = '#53fc18'
    channelName = kickChannelName
    
    async checkStream() {
        this.log(`Trying to get a status of channel ${this.channelName}`)
        const kickLink = `https://kick.com/api/v2/channels/${this.channelName}`
        
        try {
            const browser = await puppeteer.launch({headless: 'new', executablePath: executablePath()})
            const page = await browser.newPage()
    
            await page.goto(kickLink)
            
            const result = await page.evaluate(() => document.querySelector('body').innerText)
            const data = JSON.parse(result)
            const {livestream} = data
            
            if (!livestream) {
                return this.log(STREAMER_OFFLINE)
            }
            
            const {id: stream_id = 0, session_title: title = '', thumbnail: {url: preview = ''} = {}} = livestream
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            this.queue.push(stream_id)
            this.sendMessage({title, preview}, stream_id)
            
            await browser.close()
        } catch (error) {
            return this.log(INFO_NOT_FOUND)
        }
    }
}