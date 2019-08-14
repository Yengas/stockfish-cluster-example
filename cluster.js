// entrypoint for running workers with the cluster strategy. master process will handle client communication
// and there will be *NUM_OF_WORKERS* amount of worker processes to run stockfish
const cluster = require('cluster');
const benchmark = require('./benchmark');
const server = require('./index');
const isBenchmark = process.env.BENCHMARK === 'true';
const os = require('os');
const NUM_OF_WORKERS = Math.max(os.cpus().length - 1, 1);

if (cluster.isMaster) {
	const clusterMaster = require('./cluster/master');

	for (let i = 0; i < NUM_OF_WORKERS; i++) {
		const worker = cluster.fork();

		clusterMaster.addWorker(worker);
	}

	const chessBackend = require('./cluster/index');
	(isBenchmark ? benchmark : server)(chessBackend);
} else {
	require('./cluster/worker')
}
