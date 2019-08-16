// entrypoint for running workers with the independent process strategy. a redis will be created that handles
// communication between worker and master process
const bootstrap = require('./bootstrap');
const os = require('os');
const child_process = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { GenericContainer } = require('testcontainers');
const chessBackendCreator = require('../queue/index');
const CONFIG_PATH = join(__dirname, '../queue/config.json');
const WORKER_SCRIPT_PATH = join(__dirname, '../queue/worker.js');
const NUM_OF_WORKERS = Math.max(os.cpus().length - 1, 1);

async function main() {
	const redisContainer = await new GenericContainer('redis', '5.0.5').withExposedPorts(6379).start();
	const config = {
		ip: redisContainer.getContainerIpAddress(),
		port: redisContainer.getMappedPort(6379),
	};
	writeFileSync(CONFIG_PATH, JSON.stringify(config));

	const chessBackend = chessBackendCreator();
	const workerProcesses = [...new Array(NUM_OF_WORKERS)].map(() => (
		child_process.spawn(process.argv[0], [WORKER_SCRIPT_PATH])
	));

	await bootstrap(chessBackend).catch(console.error);

	[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach(event => {
		process.on(event, () => redisContainer.stop().catch(() => {}));
		workerProcesses.forEach((worker) => worker.kill());
	});

	await chessBackend.close();
	await redisContainer.stop().catch(() => {});
	workerProcesses.forEach(worker => worker.kill());
}

main().catch(console.error);
