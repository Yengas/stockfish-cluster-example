const fastify = require('fastify')();
const { getBestMove } = require('../stockfish')();

let work = Promise.resolve();

fastify.get('/chess', (request) => {
	const { fen, level, depth } = request.query;

	return work = work.then(() => getBestMove(fen, level, depth));
});


[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach(event => {
	process.on(event, () => fastify.close());
});

async function main() {
	await fastify.listen(process.argv[2]);
	console.log('started listening on:', process.argv[2]);
}

main().catch(console.error);
