# Moviebot Telegram

An open movie database written in typescript



```javascript
//index.js
import { init } from 'moviebot-telegram'
init()
```

MOVIE_DATABASE_KEY=somekey TELEGRAM_BOT_TOKEN=sometoken YOUTUBE_API_KEY=somekey node index.js

This will allow you to talk to your bot via the /movie command in telegram - e.g. /movie taken

If you supply a youtube api key, you should also get trailers.