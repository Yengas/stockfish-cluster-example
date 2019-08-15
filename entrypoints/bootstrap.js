const benchmark = require('../benchmark');
const server = require('../index');
const isBenchmark = process.env.BENCHMARK === 'true';

module.exports = chessBackend => (isBenchmark ? benchmark : server)(chessBackend);
