# discord-streams-announcer-bot

Позволяет анонсировать начало ваших стримов (Youtube/WASD) 

Для начала работы необходимо установить [NodeJS](https://nodejs.org/en/) и [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (либо не устанавливать, если ты фрик), и следом:

1. Клонировать репозиторий
2. `yarn install` (или `npm install`, если ты фрик)
3. Клонировать `.env.example` в `.env`, заполнить
    1. `DISCORD_API_KEY` - ключ доступа в [discord.developer](https://discord.com/developers/applications)
    2. `DISCORD_CHANNEL_ID` - ID дискорд канала, где должен быть webhook анонс, получается путём копирования и вставки
    3. `YOUTUBE_API_KEY` - ключ доступа в [youtube.developer](https://developers.google.com/youtube/v3)
    4. `YOUTUBE_STREAMER_ID` - ID youtube-пользователя, например ссылка `https://www.youtube.com/channel/UCTt1aYtL8sFGViCUSH07CVw`, где `UCTt1aYtL8sFGViCUSH07CVw` - тот самый ID. Обращаю внимание, что ссылка вида `https://www.youtube.com/c/СЕРЕГАПИРАТ` - залупа из-за старых гугл+, нужен именно ID, а не имя пользователя
    5. `WASD_CHANNEL_NAME` - никнейм wasd-канала, например ссылка `https://wasd.tv/serega_pirat`, где `serega_pirat` - тот самый никнейм
4. Запустить `node -r dotenv/config index`
