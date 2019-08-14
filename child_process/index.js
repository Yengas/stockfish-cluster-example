module.exports = master => ({
	async getBestMove(fen, level, depth) {
		const workId = master.addWork({ fen, level, depth });
		return await master.waitWorkReply(workId);
	}
});
