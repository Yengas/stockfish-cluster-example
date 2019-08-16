const benchmark = require('../benchmark');
const server = require('../index');
const isBenchmark = process.env.BENCHMARK === 'true';

process.on('uncaughtExpcetion', console.log);
module.exports = chessBackend => (isBenchmark ? benchmark : server)(chessBackend);
