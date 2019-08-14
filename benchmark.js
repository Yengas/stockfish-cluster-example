async function benchmark(chessBackend) {
	const fen = 'N7/P3pk1p/3p2p1/r4p2/8/4b2B/4P1KP/1R6 w - - 0 34';
	const level = 20;
	const benchmarkCount = 10000;
	const currentTime = Date.now();

	await Promise.all([...new Array(benchmarkCount)].map(() => chessBackend.getBestMove(fen, level)));

	console.log(`took ${Date.now() - currentTime} ms`);
	process.exit(0)
}

module.exports = benchmark;
