import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, STREAMER_OFFLINE} from "../errors.js"
import puppeteer from "puppeteer-extra"
import {kick_timeout_limit} from "../constants.js"

const kickChannelName = process.env.KICK_CHANNEL_NAME

export default class KickAnnouncer extends BaseAnnouncer {
    platformName = 'Kick'
    platformLogo = 'https://i.imgur.com/rpTKwrq.png'
    platformLink = 'https://kick.com/'
    platformColor = '#53fc18'
    channelName = kickChannelName
    interval = kick_timeout_limit
    browser = null
    
    async checkStream() {
        this.log(`Trying to get a status of channel ${this.channelName}`)
        const kickLink = `https://kick.com/api/v2/channels/${this.channelName}`
        
        try {
            this.browser = await puppeteer.launch({
                headless: 'new',
                executablePath: process.env.CHROMIUM_PATH,
                userDataDir: '/dev/null',
                args: ['--no-sandbox']
            })
            
            const page = await this.browser.newPage()
            await page.goto(kickLink)
            
            const result = await page.evaluate(() => document.querySelector('body').innerText)
            const data = JSON.parse(result)
            await this.browser.close()
            
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
        } catch (error) {
            if (this.browser !== null && typeof this.browser.close !== "undefined") {
                this.log('puppetear connection closed')
                this.browser.close()
            }
            
            return this.log(error)
        }
    }
}