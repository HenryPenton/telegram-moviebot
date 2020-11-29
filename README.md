# Moviebot Telegram

An open movie database bot written in typescript.

```javascript
//index.js
import { init } from "moviebot-telegram";
init();
```

```bash
MOVIE_DATABASE_KEY=somekey TELEGRAM_BOT_TOKEN=sometoken YOUTUBE_API_KEY=somekey node index.js
```

MOVIE_DATABASE_KEY is an API key for the [Open Movie Database](http://www.omdbapi.com/).

TELEGRAM_BOT_TOKEN is a bot token received by talking to the BotFather on Telegram.

## Commands

### movie

Running /movie _movieName_ will return you information for _movieName_, if it exists.

If you supplied a Youtube API key in the first stage, you should also get trailers in the message.

## setmovie

Running /setmovie _movieName_ will add _movieName_ to a state. This state currently gets wiped if the bot ever restarts.

## getmovies

Running /getmovies will return you all of the movies set previously using the setmovie command.

## moviepoll

Running /moviepoll will return you all of the movies you set previously using the setmovie command, but in the format of a poll.
