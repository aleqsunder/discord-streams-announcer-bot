# discord-streams-announcer-bot

## [EN]

Allows you to announce the start of your streams (Youtube/WASD/Trovo/Twitch) 

To get started you need to install [NodeJS](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (or don't install if you're a freak), and then:

  1. Clone the repository
  2. `yarn install` (or `npm install`)
  3. Clone `.env.example` into `.env`, fill in
  4. Run `node -r dotenv/config index`

<details>
  <summary>How to fill .env</summary>
  
  1. `DISCORD_API_KEY` - access key in [discord.developer](https://discord.com/developers/applications)
  2. `DISCORD_CHANNEL_ID` - ID of the discord channel where the webhook announcement should be, obtained by copying and pasting
  3. `YOUTUBE_API_KEY` - access key in [youtube.developer](https://developers.google.com/youtube/v3), you can specify several keys separated by commas, the interval of requests will adjust to the number of transferred keys
  4. `YOUTUBE_STREAMER_ID` - the ID of youtube-user, for example link `https://www.youtube.com/channel/UCTt1aYtL8sFGViCUSH07CVw`, where `UCTt1aYtL8sFGViCUSH07CVw` is that ID. Note that a link of the form `https://www.youtube.com/c/СЕРЕГАПИРАТ` is a dick because of the old Google+, you need exactly the ID, not the username
  5. `TROVO_CHANNEL_NAME` - trovo channel nickname, e.g. link `https://trovo.live/s/serega_pirat`, where `serega_pirat` is the same nickname
  6. `WASD_CHANNEL_NAME` - the nickname of the wasd-channel, for example a link `https://wasd.tv/serega_pirat`, where `serega_pirat` - the same nickname
  7. `TWITCH_CLIENT_ID` - client_id from twitch develop
  8. `TWITCH_CLIENT_SECRET` - client_secret from twitch develop
  9. `TWITCH_CHANNEL_NAME` - the nickname of the twitch channel, for example the link `https://twitch.tv/serega_pirat` where `serega_pirat` is the same nickname

</details>

## [RU]

Позволяет анонсировать начало ваших стримов (Youtube/WASD/Trovo/Twitch) 

Для начала работы необходимо установить [NodeJS](https://nodejs.org/en/) и [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (либо не устанавливать, если ты фрик), и следом:

1. Клонировать репозиторий
2. `yarn install` (или `npm install`)
3. Клонировать `.env.example` в `.env`, заполнить
4. Запустить `node -r dotenv/config index`

<details>
  <summary>How to fill .env</summary>
  
   1. `DISCORD_API_KEY` - ключ доступа в [discord.developer](https://discord.com/developers/applications)
   2. `DISCORD_CHANNEL_ID` - ID дискорд канала, где должен быть webhook анонс, получается путём копирования и вставки
   3. `YOUTUBE_API_KEY` - ключ доступа в [youtube.developer](https://developers.google.com/youtube/v3), можно указать несколько ключей через запятую, интервал запросов подстроится под количество переданных ключей
   4. `YOUTUBE_STREAMER_ID` - ID youtube-пользователя, например ссылка `https://www.youtube.com/channel/UCTt1aYtL8sFGViCUSH07CVw`, где `UCTt1aYtL8sFGViCUSH07CVw` - тот самый ID. Обращаю внимание, что ссылка вида `https://www.youtube.com/c/СЕРЕГАПИРАТ` - залупа из-за старых гугл+, нужен именно ID, а не имя пользователя
   5. `TROVO_CHANNEL_NAME` - никнейм трово-канала, например ссылка `https://trovo.live/s/serega_pirat`, где `serega_pirat` - тот самый никнейм
   6. `WASD_CHANNEL_NAME` - никнейм wasd-канала, например ссылка `https://wasd.tv/serega_pirat`, где `serega_pirat` - тот самый никнейм
   7. `TWITCH_CLIENT_ID` - client_id из twitch develop
   8. `TWITCH_CLIENT_SECRET` - client_secret из twitch develop
   9. `TWITCH_CHANNEL_NAME` - никнейм twitch-канала, например ссылка `https://twitch.tv/serega_pirat`, где `serega_pirat` - тот самый никнейм
  
</details>
