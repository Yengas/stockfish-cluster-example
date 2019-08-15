// entrypoint for a single process that queues getBestMove requests and processes them one by one with a single engine
const bootstrap = require('./bootstrap');
const chessBackend = require('../single');

bootstrap(chessBackend).catch(console.error);
