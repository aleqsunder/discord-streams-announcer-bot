import YoutubeAnnouncer from "./youtube-announcer.js"
import WasdAnnouncer from "./wasd-announcer.js"
import TrovoAnnouncer from "./trovo-announcer.js"
import TwitchAnnouncer from "./twitch-announcer.js"
import VkPlayAnnouncer from "./vk-play-announcer.js"
import CaffeineAnnouncer from "./caffeine-announcer.js"

export default [
    new YoutubeAnnouncer(),
    new WasdAnnouncer(),
    new TrovoAnnouncer(),
    new TwitchAnnouncer(),
    new VkPlayAnnouncer(),
    new CaffeineAnnouncer(),
]