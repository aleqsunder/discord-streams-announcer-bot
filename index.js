import AnnouncerBot from './extends/js/announcer-bot.js'

const bot = new AnnouncerBot(process.env.DISCORD_API_KEY)
bot.init()