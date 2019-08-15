const url = require('url');
const { Server: WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

function server(chessBackend) {
	wss.on('connection', (ws, req) => {
		const { query: { level, depth } } = url.parse(req.url, true);

		ws.on('message', async (fen) => {
			try {
				const bestMove = await chessBackend.getBestMove(fen, level, depth);

				ws.send(bestMove);
			} catch (err) {
				ws.send(`err: ${err.message}`)
			}
		});
	});


	[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach(event => {
		process.on(event, () => wss.close());
	});

	return new Promise(resolve => {
		wss.on('close', () => resolve());
	});
}

module.exports = server;
