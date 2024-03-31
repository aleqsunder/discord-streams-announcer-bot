import {GatewayIntentBits} from 'discord.js'

export const youtube_timeout_limit = 9e5 // 15 минут
export const kick_timeout_limit = 6e5 // 10 минут

export const discord_intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
export const default_headers = {Accept: 'application/json'}
export const webhook_user = {
    name: 'Оповещатель',
    avatar: 'https://i.imgur.com/DIxR2g7.png',
}

export const NOTAUTHORIZED = "Not authorized"
export const UNEXPECTED = "Unexpected"
export const SESSION_RESTORED = "Session restored"