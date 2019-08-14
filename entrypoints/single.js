const benchmark = require('../benchmark');
const server = require('../index');
const isBenchmark = process.env.BENCHMARK === 'true';
const chessBackend = require('../single');

(isBenchmark ? benchmark : server)(chessBackend);
