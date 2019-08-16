// entrypoint for running workers with the independent process strategy. a REST server will be created for each worker.
// communication between worker and master process will be done with REST API
const bootstrap = require('./bootstrap');
const os = require('os');
const child_process = require('child_process');
const { join } = require('path');
const chessBackendCreator = require('../rest/index');
const SERVER_SCRIPT_PATH = join(__dirname, '../rest/server.js');
const NUM_OF_WORKERS = Math.max(os.cpus().length - 1, 1);

async function main() {
	const ports = [...new Array(NUM_OF_WORKERS)].map((_, i) => 7300 + i);
	const chessBackend = chessBackendCreator('localhost', ports);
	const serverProcesses = ports.map(port => (
		child_process.spawn(process.argv[0], [SERVER_SCRIPT_PATH, port.toString()], { stdio: 'inherit' })
	));

	await new Promise(resolve => setTimeout(resolve, 1000));
	await bootstrap(chessBackend).catch(console.error);

	[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach(event => {
		serverProcesses.forEach((worker) => worker.kill());
	});

	serverProcesses.forEach(worker => worker.kill());
}

main().catch(console.error);
