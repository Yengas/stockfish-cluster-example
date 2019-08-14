const master = require('./master');

module.exports = {
	async getBestMove(fen, level, depth) {
		const workId = master.addWork({ fen, level, depth });
		return await master.waitWorkReply(workId);
	}
};
