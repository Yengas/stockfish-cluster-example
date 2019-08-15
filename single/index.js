const { getBestMove: realGetBestMove } = require('../stockfish')();
let work = Promise.resolve();

module.exports = {
	async getBestMove(fen, level, depth) {
		return work = work.then(() => realGetBestMove(fen, level, depth));
	},
};
