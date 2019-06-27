# MusicMate

![Template demo](https://github.com/saulve/MusicMate/blob/master/promo-screenshot.jpg)

MusicMate is a free and non-profit browser extension autonomously locating nearby concerts by artists you're listening to on Spotify. It helps you catch "early bird" tickets, which can be up to 90% cheaper than standard.

The app features desktop notifications, reminders and direct links to tickets saving you time for things that really matter.

This repository contains the client-side Google Chrome extension written in Vue Js.

## Workaround for lack of Websockets

As it stands Spotify's Web API, does not provide Websockets support, meaning that the only way to keep a track of what's currently being listened to is by periodically sending HTTP requests. With more than a few users constantly issuing requests apps using Spotify's Web API quickly reach API rate limits. It's a [well-known](https://github.com/spotify/web-api/issues/492) issue, which creates challenges to developers, who wish to leverage real-time knowledge of the user's currently listened tracks.

To tackle this issue this app uses a custom algorithm, written based on [the song skipping](https://musicmachinery.com/2014/05/02/the-skip/) dataset, which alternates the app between 4 cycles to reduce the number of sent API requests and make it more scaleable.

The algorithm can be found in `src/store/actions/engine.js` whilst the cycle times reside in `src/common/constants.js`.
