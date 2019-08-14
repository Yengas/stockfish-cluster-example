const benchmark = require('./benchmark');
const server = require('./index');
const isBenchmark = process.env.BENCHMARK === 'true';
const chessBackend = require('./single/index');

(isBenchmark ? benchmark : server)(chessBackend);
