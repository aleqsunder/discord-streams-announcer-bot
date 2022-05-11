# discord-youtube-announcer-bot

Для начала работы необходимо установить [NodeJS](https://nodejs.org/en/) и [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (либо не устанавливать, если ты фрик), и следом:

1. Клонировать репозиторий
2. `yarn install` (или `npm install`, если ты фрик)
3. Клонировать `.env.example` в `.env`, заполнить
    1. `YOUTUBE_API_KEY` - ключ доступа в [youtube.developer](https://developers.google.com/youtube/v3)
    2. `DISCORD_API_KEY` - ключ доступа в [discord.developer](https://discord.com/developers/applications)
    3. `YOUTUBE_STREAMER_ID` - ID youtube-пользователя, например ссылка `https://www.youtube.com/channel/UCTt1aYtL8sFGViCUSH07CVw`, где `UCTt1aYtL8sFGViCUSH07CVw` - тот самый ID. Обращаю внимание, что ссылка вида `https://www.youtube.com/c/%D0%A1%D0%95%D0%A0%D0%95%D0%93%D0%90%D0%9F%D0%98%D0%A0%D0%90%D0%A2` - залупа из-за старых гугл+, нужен именно ID, а не имя пользователя
    4. `DISCORD_CHANNEL_ID` - ID дискорд канала, где должен быть webhook анонс, получается путём копирования и вставки
4. Запустить `node -r dotenv/config index`
