const uuidv4 = require('uuid/v4');
const { MasterActions, WorkerActions, WorkerStatus } = require('./constants');

const workWaitingMap = new Map();
const workerInfos = [];
const workQueue = [];

module.exports = {
	addWorker(worker) {
		const workerInfo = { worker, status: WorkerStatus.Working };
		workerInfos.push(workerInfo);

		worker.on('message', (action) => {
			if (action.type === WorkerActions.RequestWork) {
				if (workQueue.length > 0) {
					worker.send({ type: MasterActions.SendWork, work: workQueue.shift() });
				} else {
					workerInfo.status = WorkerStatus.WantsWork;
				}
			} else if (action.type === WorkerActions.ReplyBestMove) {
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
		const workerInfo = workerInfos.find(({ status }) => status === WorkerStatus.WantsWork);
		const work = { id: workId, params };

		if (workerInfo) {
			workerInfo.status = WorkerStatus.Working;
			workerInfo.worker.send({ type: MasterActions.SendWork, work })
		} else {
			workQueue.push(work);
		}

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
