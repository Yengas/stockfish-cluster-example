const { getBestMove } = require('../stockfish')();
const queue = require('./createQueue')();

queue.process(({ data: { fen, level, depth }}) => getBestMove(fen, level, depth));
