const readline = require('readline');
const WebSocket = require('ws');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const level = 20;
const ws = new WebSocket(`ws://localhost:8080/chess?level=${level}`);

ws.on('message', msg => console.log('server says:', msg));
rl.on('line', line => ws.send(line));
