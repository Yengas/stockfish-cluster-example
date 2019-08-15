const { getBestMove } = require('../stockfish')();
const { WorkerActions, MasterActions } = require('./constants');

async function createReply({ fen, level, depth }) {
	return getBestMove(fen, level, depth);
}

function requestWork() {
	process.send({ type: WorkerActions.RequestWork });
}

function sendResponse(workId, reply) {
	process.send({ type: WorkerActions.ReplyBestMove, workId, reply });
}

let work = Promise.resolve();

async function doWork({ id: workId, params }) {
	try {
		const reply = await createReply(params);

		sendResponse(workId, reply);
	} catch(err) {
		console.error('there was an error when processing work:', err.message);
	}
}

process.on('message', async (action) => {
	if (action.type === MasterActions.SendWork) {
		work = work.then(() => {
			return doWork(action.work)
				.catch(console.error)
				.then(() => requestWork());
		});
	}
});

// initial work request
requestWork();
