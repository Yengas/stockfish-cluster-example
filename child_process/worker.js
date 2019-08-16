const { getBestMove } = require('../stockfish')();
const { MasterActions, WorkerActions } = require('./constants');

function sendResponse(workId, reply) {
	process.send({ type: WorkerActions.ReplyBestMove, workId, reply });
}

async function findBestMoveAndSendReply({ id: workId, params: { fen, level, depth } }) {
	try {
		const reply = await getBestMove(fen, level, depth);

		sendResponse(workId, reply);
	} catch(err) {
		console.error('there was an error when processing work:', err.message);
	}
}

let work = Promise.resolve();

process.on('message', async (action) => {
	if (action.type === MasterActions.SendWork) {
		work = work.then(() => (
			findBestMoveAndSendReply(action.work)
				.catch(console.error)
		));
	}
});
