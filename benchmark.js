async function benchmark(chessBackend) {
	const fen = 'N7/P3pk1p/3p2p1/r4p2/8/4b2B/4P1KP/1R6 w - - 0 34';
	const level = 20;
	const benchmarkCount = parseInt(process.env.BENCHMARK_ANALYSIS_COUNT || '1000', 10);
	const currentTime = Date.now();
	console.log('starting the benchmark');

	try {
		await Promise.all([...new Array(benchmarkCount)].map(() => chessBackend.getBestMove(fen, level)));
	} catch (err) {
		console.log(`benchmark failed:`, err.message);
	}

	console.log(`took ${Date.now() - currentTime} ms`);
}

module.exports = benchmark;
