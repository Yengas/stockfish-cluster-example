const { getBestMove } = require('../stockfish')();
const { WorkerActions, MasterActions } = require('./constants');

async function createReply({ fen, level, depth }) {
	return getBestMove(fen, level, depth);
}

const workQueue = [];
let inProgress = false;

function requestWork() {
	process.send({ type: WorkerActions.RequestWork });
}

function sendResponse(workId, reply) {
	process.send({ type: WorkerActions.ReplyBestMove, workId, reply });
}

async function dequeueWorkAndProcess() {
	if (workQueue.length === 0) throw new Error('work queue is empty, can not process anything');
	const { id: workId, params } = workQueue.shift();

	try {
		const reply = await createReply(params);

		sendResponse(workId, reply);
	} catch(err) {
		// not re-queuing work for cluster POC, see queue version
		console.error(`could not process workId: ${workId}, err:`, err.message)
	}
}

async function doWork() {
	// can not handle more than one work at once, because there is one chess engine per worker
	if (inProgress === true || workQueue.length === 0) return false;
	inProgress = true;

	try {
		await dequeueWorkAndProcess();
	} catch(err) {
		console.error('there was an error when dequeuing work:', err.message);
	} finally {
		inProgress = false;
	}

	if (workQueue.length > 0) setTimeout(doWork, 0);
	else requestWork();
}

async function handleIncomingWork(work) {
	workQueue.push(work);
	return doWork();
}

process.on('message', async (action) => {
	if (action.type === MasterActions.SendWork) {
		handleIncomingWork(action.work).catch(console.error);
	}
});

// initial work request
requestWork();
