const { getBestMove } = require('../stockfish')();
const { WorkerActions, MasterActions } = require('./constants');

async function createReply({ fen, level, depth }) {
	return getBestMove(fen, level, depth);
}

let inProgress = false;

function requestWork() {
	process.send({ type: WorkerActions.RequestWork });
}

function sendResponse(workId, reply) {
	process.send({ type: WorkerActions.ReplyBestMove, workId, reply });
}

async function doWork({ id: workId, params }) {
	// can not handle more than one work at once, because there is one chess engine per worker
	if (inProgress === true) throw new Error('can not process more than one at the same time');
	inProgress = true;

	try {
		const reply = await createReply(params);

		sendResponse(workId, reply);
	} catch(err) {
		console.error('there was an error when processing work:', err.message);
	} finally {
		inProgress = false;
	}
}

process.on('message', async (action) => {
	if (action.type === MasterActions.SendWork) {
		await doWork(action.work).catch(console.error);
		requestWork();
	}
});

// initial work request
requestWork();
