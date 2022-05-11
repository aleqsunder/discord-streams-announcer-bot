import {Intents} from 'discord.js'

export const youtube_timeout = 9e5 // 900 секунд, 15 минут
export const wasd_timeout    = 6e4 // 60 секунд, 1 минута

export const discord_intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
export const default_headers = {Accept: 'application/json'}
export const webhook_user = {
    name: 'Оповещатель',
    avatar: 'https://i.imgur.com/DIxR2g7.png',
}