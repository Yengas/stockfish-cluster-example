const axios = require('axios');

module.exports = (host, ports) => {
	return {
		async getBestMove(fen, level, depth) {
			const port = ports[Math.floor(Math.random() * ports.length)];
			let url = `http://${host}:${port}/chess?fen=${encodeURIComponent(fen)}&level=${level}`;

			if (depth) url += `&depth=${depth}`;
			const { data: body } = await axios.get(url);
			return body;
		},
	}
};
