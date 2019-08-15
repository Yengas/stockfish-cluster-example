const benchmark = require('../benchmark');
const server = require('../index');
const isBenchmark = process.env.BENCHMARK === 'true';
const chessBackend = require('../per_call');

(isBenchmark ? benchmark : server)(chessBackend);
