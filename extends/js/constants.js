import {Intents} from 'discord.js'

export const default_timeout = 9e5
export const api_path = 'https://www.googleapis.com/youtube/v3'
export const discord_intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
export const default_headers = {Accept: 'application/json'}
export const webhook_user = {
    name: 'Оповещатель',
    avatar: 'https://i.imgur.com/DIxR2g7.png',
}