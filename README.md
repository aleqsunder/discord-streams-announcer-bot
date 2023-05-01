# discord-streams-announcer-bot

<img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_YouTube_%282015-2017%29.svg" alt=“” height="35px" style="margin-right: 20px">
<img src="https://st.wasd.tv/upload/channel_images/9851a36c-1abb-4c30-a92d-f433a80d226d/original.png" alt=“” height="35px" style="margin-right: 20px">
<img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Trovo_Logo.png" alt=“” height="35px" style="margin-right: 20px">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Twitch_logo_%28wordmark_only%29.svg/2560px-Twitch_logo_%28wordmark_only%29.svg.png" alt=“” height="35px" style="margin-right: 20px">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/VK_Play_logo.svg/2560px-VK_Play_logo.svg.png" alt=“” height="35px" style="margin-right: 20px">
<img src="https://i.imgur.com/Wggqcrx.png" alt=“” height="35px" style="margin-right: 20px">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/GoodGame_logo.svg/800px-GoodGame_logo.svg.png" alt=“” height="35px" style="margin-right: 20px">

## [EN]

Allows you to announce the start of your streams: Youtube, WASD, Trovo, Twitch, VkPlay, Caffeine and GoodGame!

To get started you need to install [NodeJS](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (or don't install if you're a freak), and then:

  1. Clone the repository
  2. `yarn install` (or `npm install`)
  3. Clone `.env.example` into `.env`, fill in
  4. Run `node -r dotenv/config index`

<details>
  <summary>How to fill .env</summary>
  
  ##
  
  It is obligatory to fill in the fields for Discord bot, the other items - as needed\
  If you only need YouTube or WASD, you can leave Twitch or Trovo fields blank
  
  ### Discord
  
`DISCORD_API_KEY` - access key in [discord.developer](https://discord.com/developers/applications)\
`DISCORD_CHANNEL_ID` - ID of the discord channel where the webhook announcement should be, obtained by copying and pasting
  
  ### YouTube (optional)
  
`YOUTUBE_API_KEY` - access key in [youtube.developer](https://developers.google.com/youtube/v3), you can specify several keys separated by commas, the interval of requests will adjust to the number of transferred keys\
`YOUTUBE_STREAMER_ID` - the ID of youtube-user, for example link `https://www.youtube.com/channel/UCTt1aYtL8sFGViCUSH07CVw`, where `UCTt1aYtL8sFGViCUSH07CVw` is that ID. Note that a link of the form `https://www.youtube.com/c/СЕРЕГАПИРАТ` is a dick because of the old Google+, you need exactly the ID, not the username

  ### Trovo (optional)
  
`TROVO_CHANNEL_NAME` - trovo channel nickname, e.g. link `https://trovo.live/s/serega_pirat`, where `serega_pirat` is the same nickname

  ### WASD (optional)
  
`WASD_CHANNEL_NAME` - the nickname of the wasd-channel, for example a link `https://wasd.tv/serega_pirat`, where `serega_pirat` - the same nickname

  ### Twitch (optional)
  
`TWITCH_CLIENT_ID` - client_id from twitch develop\
`TWITCH_CLIENT_SECRET` - client_secret from twitch develop\
`TWITCH_CHANNEL_NAME` - the nickname of the twitch channel, for example the link `https://twitch.tv/serega_pirat` where `serega_pirat` is the same nickname

  ### VK PLAY (optional)
  
`VKPLAY_CHANNEL_NAME` - the nickname of the vklive-channel, for example a link `https://vkplay.live/serega_pirat`, where `serega_pirat` - the same nickname

  ### CAFFEINE.TV (optional)
  
`CAFFEINE_CHANNEL_NAME` - the nickname of the caffeine-channel, for example a link `https://www.caffeine.tv/serega_pirat`, where `serega_pirat` - the same nickname

  ### GOODGAME.RU (optional)

`GOODGAME_CHANNEL_NAME` - the nickname of the goodgame-channel, for example a link `https://goodgame.ru/serega_pirat`, where `serega_pirat` - the same nickname

</details>

## [RU]

Позволяет анонсировать начало ваших стримов: Youtube, WASD, Trovo, Twitch, VkPlay, Caffeine и GoodGame!

Для начала работы необходимо установить [NodeJS](https://nodejs.org/en/) и [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (либо не устанавливать, если ты фрик), и следом:

1. Клонировать репозиторий
2. `yarn install` (или `npm install`)
3. Клонировать `.env.example` в `.env`, заполнить
4. Запустить `node -r dotenv/config index`

<details>
  <summary>Как заполнить .env</summary>
  
  ##
  
  Обязательно необходимо заполнить поля для Discord бота, остальные пункты - по мере надобности\
  Если вам нужен только YouTube или WASD, то поля Твич или Трово можно оставить пустыми
  
  ### Дискорд
  
`DISCORD_API_KEY` - ключ доступа в [discord.developer](https://discord.com/developers/applications)\
`DISCORD_CHANNEL_ID` - ID дискорд канала, где должен быть webhook анонс, получается путём копирования и вставки

  ### YouTube (не обязательно)

`YOUTUBE_API_KEY` - ключ доступа в [youtube.developer](https://developers.google.com/youtube/v3), можно указать несколько ключей через запятую, интервал запросов подстроится под количество переданных ключей\
`YOUTUBE_STREAMER_ID` - ID youtube-пользователя, например ссылка `https://www.youtube.com/channel/UCTt1aYtL8sFGViCUSH07CVw`, где `UCTt1aYtL8sFGViCUSH07CVw` - тот самый ID. Обращаю внимание, что ссылка вида `https://www.youtube.com/c/СЕРЕГАПИРАТ` - залупа из-за старых гугл+, нужен именно ID, а не имя пользователя

  ### Трово (не обязательно)

`TROVO_CHANNEL_NAME` - никнейм трово-канала, например ссылка `https://trovo.live/s/serega_pirat`, где `serega_pirat` - тот самый никнейм

  ### WASD (не обязательно)

`WASD_CHANNEL_NAME` - никнейм wasd-канала, например ссылка `https://wasd.tv/serega_pirat`, где `serega_pirat` - тот самый никнейм

  ### Твич (не обязательно)

`TWITCH_CLIENT_ID` - client_id из twitch develop\
`TWITCH_CLIENT_SECRET` - client_secret из twitch develop\
`TWITCH_CHANNEL_NAME` - никнейм twitch-канала, например ссылка `https://twitch.tv/serega_pirat`, где `serega_pirat` - тот самый никнейм

  ### ВК ПЛЕЙ (не обязательно)
  
`VKPLAY_CHANNEL_NAME` - никнейм вкплей-канала, например ссылка `https://vkplay.live/serega_pirat`, где `serega_pirat` - тот самый никнейм

  ### CAFFEINE.TV (не обязательно)
  
`CAFFEINE_CHANNEL_NAME` - никнейм caffeine-канала, например ссылка `https://www.caffeine.tv/serega_pirat`, где `serega_pirat` - тот самый никнейм

  ### GOODGAME.RU (не обязательно)

`GOODGAME_CHANNEL_NAME` - никнейм goodgame-канала, например ссылка `https://goodgame.ru/serega_pirat`, где `serega_pirat` - тот самый никнейм
  
</details>
