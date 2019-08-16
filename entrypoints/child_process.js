// entrypoint for running workers with the child process strategy. master process will handle client communication
// and there will be *NUM_OF_WORKERS* amount of worker processes to run stockfish
const bootstrap = require('./bootstrap');
const child_process = require('child_process');
const os = require('os');
const NUM_OF_WORKERS = Math.max(os.cpus().length - 1, 1);
const clusterMaster = require('../child_process/master');

const workers = [];

for (let i = 0; i < NUM_OF_WORKERS; i++) {
	const worker = child_process.fork(require.resolve('../child_process/worker'));

	clusterMaster.addWorker(worker);
	workers.push(worker);
}

function stop() {
	workers.forEach(worker => worker.kill());
}


[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach(event => {
	process.on(event, () => stop());
});

const chessBackend = require('../child_process')(clusterMaster);
bootstrap(chessBackend).catch(console.error).then(stop);
