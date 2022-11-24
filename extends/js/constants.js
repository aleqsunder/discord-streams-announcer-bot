import {Intents} from 'discord.js'

export const youtube_timeout_limit = 9e5
export const wasd_timeout = 6e4 // 60 секунд, 1 минута
export const trovo_timeout = 3e4 // 30 секунд

export const discord_intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
export const default_headers = {Accept: 'application/json'}
export const webhook_user = {
    name: 'Оповещатель',
    avatar: 'https://i.imgur.com/DIxR2g7.png',
}

export const youtube_logo = 'https://i.imgur.com/S4DsV5h.png'
export const wasd_logo = 'https://i.imgur.com/nNwvbQp.png'
export const trovo_logo = 'https://i.imgur.com/17ZhzQa.png'