const createStockfishFunctions = require('../stockfish');

module.exports = {
	async getBestMove(fen, level, depth) {
		const { getBestMove: realGetBestMove, quit } = createStockfishFunctions();
		const result = await realGetBestMove(fen, level, depth);

		quit();
		return result;
	},
};
