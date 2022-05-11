import YoutubeAnnouncerBot from './extends/js/youtube-announcer-bot.js'

const bot = new YoutubeAnnouncerBot(process.env.DISCORD_API_KEY)
bot.init()