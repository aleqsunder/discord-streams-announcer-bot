import YoutubeAnnouncer from "./youtube-announcer.js"
import TrovoAnnouncer from "./trovo-announcer.js"
import TwitchAnnouncer from "./twitch-announcer.js"
import VkPlayAnnouncer from "./vk-play-announcer.js"
import CaffeineAnnouncer from "./caffeine-announcer.js"
import GoodGameAnnouncer from "./goodgame-announcer.js"
import KickAnnouncer from "./kick-announcer.js"
import OpenRecAnnouncer from "./openrec-announcer.js"

export default [
    new YoutubeAnnouncer(),
    new TrovoAnnouncer(),
    new TwitchAnnouncer(),
    new VkPlayAnnouncer(),
    new CaffeineAnnouncer(),
    new GoodGameAnnouncer(),
    new KickAnnouncer(),
    new OpenRecAnnouncer(),
]