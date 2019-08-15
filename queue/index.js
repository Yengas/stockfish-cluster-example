const createQueue = require('./createQueue');

module.exports = () => {
	const queue = createQueue();

	return {
		getBestMove(fen, level, depth) {
			return new Promise((resolve, reject) => {
				const job = queue.createJob({ fen, level, depth });

				job.save();
				job.on('succeeded', result => resolve(result));
				job.on('error', err => reject(err));
			});
		},
		close() {
			return queue.close();
		}
	}
};
