// entrypoint for the chess backend that creates an engine per every getBestMove call
const bootstrap = require('./bootstrap');
const chessBackend = require('../per_call');

bootstrap(chessBackend).catch(console.error);
