const uuidv4 = require('uuid/v4');
const { MasterActions, WorkerActions } = require('./constants');

const workWaitingMap = new Map();
const workers = [];

module.exports = {
	addWorker(worker) {
		workers.push(worker);

		worker.on('message', (action) => {
			if (action.type === WorkerActions.ReplyBestMove) {
				const { workId, reply } = action;
				const waitingFunctions = workWaitingMap.get(workId);
				workWaitingMap.delete(workId);

				if (Array.isArray(waitingFunctions))
					waitingFunctions.forEach(func => func(reply));
			}
		});
	},
	addWork(params) {
		const workId = uuidv4();
		const worker = workers[Math.floor(Math.random() * workers.length)];
		const work = { id: workId, params };

		worker.send({ type: MasterActions.SendWork, work });
		return workId;
	},
	waitWorkReply(workId) {
		return new Promise((resolve) => {
			if (!workWaitingMap.has(workId)) {
				workWaitingMap.set(workId, []);
			}

			workWaitingMap.get(workId).push(resolve);
		});
	},
};
