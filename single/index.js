const engineCreator = require('../stockfish');

module.exports = {
	async getBestMove(fen, level, depth) {
		const { getBestMove: realGetBestMove } = engineCreator();
		return realGetBestMove(fen, level, depth);
	},
};
