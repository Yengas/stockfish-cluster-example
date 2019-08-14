const stockfishCreator = require('stockfish');

function parseBestMove(line) {
	if (!line.startsWith('bestmove')) return undefined;
	return line.split(' ')[1];
}

module.exports = () => {
	const stockfish = stockfishCreator();
	stockfish.onmessage = () => {};

	/**
	 * Should not be called in parallel.
	 * Example: getBestMove('N7/P3pk1p/3p2p1/r4p2/8/4b2B/4P1KP/1R6 w - - 0 34', 3);
	 * @param fen current placement of the board and information
	 * @param level engine skine level, between 0-20
	 * @param [depth] how further the engine should search
	 */
	function getBestMove(fen, level, depth) {
		// TODO: Does not have error handling logic. See UCI protocol.
		return new Promise((resolve, reject) => {
			stockfish.onmessage = line => {
				const bestMove = parseBestMove(line);
				if (bestMove) resolve(bestMove);
			};

			// TODO: according to the UCI protocol, should check if the engine is ready.
			stockfish.postMessage(`ucinewgame`);
			stockfish.postMessage(`setoption name Skill Level value ${level}`);
			stockfish.postMessage(`position fen ${fen}`);
			stockfish.postMessage(`go${depth ? ' depth' + depth : ''}`);
		});
	}

	return {
		getBestMove,
	};
};
