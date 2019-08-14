// entrypoint for running workers with the child process strategy. master process will handle client communication
// and there will be *NUM_OF_WORKERS* amount of worker processes to run stockfish
const child_process = require('child_process');
const benchmark = require('../benchmark');
const server = require('../index');
const isBenchmark = process.env.BENCHMARK === 'true';
const os = require('os');
const NUM_OF_WORKERS = Math.max(os.cpus().length - 1, 1);
const clusterMaster = require('../child_process/master');

for (let i = 0; i < NUM_OF_WORKERS; i++) {
	const worker = child_process.fork(require.resolve('../child_process/worker'));

	clusterMaster.addWorker(worker);
}

const chessBackend = require('../child_process')(clusterMaster);
(isBenchmark ? benchmark : server)(chessBackend);
