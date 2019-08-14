const { getBestMove: realGetBestMove } = require('../stockfish')();
const queue = [];
let inProgress = false;

async function doWork() {
	if (inProgress || queue.length === 0) return false;
	inProgress = true;

	try {
		const { params: { fen, level, depth }, resolve } = queue.shift();
		const reply = await realGetBestMove(fen, level, depth);

		resolve(reply);
	} catch(err) {
		console.error('error processing messages:', err.message);
	} finally {
		inProgress = false;
	}

	if (queue.length > 0) setTimeout(doWork, 0);
}

module.exports = {
	async getBestMove(fen, level, depth) {
		return new Promise(resolve => {
			queue.push({ params: { fen, level, depth }, resolve });
			doWork();
		});
	},
};
