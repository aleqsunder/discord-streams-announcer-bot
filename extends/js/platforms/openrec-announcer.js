import BaseAnnouncer from "../base-announcer.js"
import {ALERT_ALREADY_CREATED, INFO_NOT_FOUND, STREAMER_OFFLINE} from "../errors.js"

const openRecChannelName = process.env.OPENREC_CHANNEL_NAME

export default class OpenRecAnnouncer extends BaseAnnouncer {
    platformName = 'OPENREC'
    platformLogo = 'https://i.imgur.com/pH9lRvn.png'
    platformLink = 'https://www.openrec.tv/user/'
    platformColor = 0xE7E5F0
    channelName = openRecChannelName
    
    async checkStream() {
        const link = `https://public.openrec.tv/external/api/v5/channels/${this.channelName}`
        
        try {
            const data = await this.getData(link)
            const {onair_broadcast_movies: movies = [], is_live = false, l_cover_image_url: preview = ''} = data
            const [movie = {}] = movies
            const {id: stream_id = 0, title = ''} = movie
            
            if (is_live !== true || stream_id === null) {
                return this.log(STREAMER_OFFLINE)
            }
            if (this.queue.includes(stream_id)) {
                return this.log(ALERT_ALREADY_CREATED)
            }
            
            this.queue.push(stream_id)
            this.sendMessage({
                title,
                preview
            }, stream_id)
        } catch (error) {
            return this.log(INFO_NOT_FOUND)
        }
    }
}
