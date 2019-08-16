# stockfish-cluster-example
A websocket server and a client is provided, where the client asks for the next best move to server by providing the [FEN](https://support.chess.com/customer/portal/articles/1444914-what-is-pgn-fen-) of the game state. Project demonstrates how to run multiple instances of [stockfish](https://github.com/nmrugg/stockfish.js) engine behind the node.js socket server. Multiple strategies are implemented for study purposes. 

## Note About Stockfish Library
*stockfish* library used is a webassembly module, that runs in the same thread as your node.js process. Making it unfeasible scale the client count without affecting websocket server performance.

## Implemented Strategies
- *per_call* a stockfish engine is created per socket call. Since the library does not support disposing of the module, this will result in a memory leak and an eventual OOM.
- *single* a single stockfish engine is created for the whole process. All analysis requests are processed one by one. This will cause the analysis to get slower as the client count increases. And if you don't do it with a worker thread/process, it may affect server performance.
- *child_process* creates worker processes on the same host, according to the CPU count of the machine. IPC channel is built between these workers, and the analysis work is distributed between the workers.
- *rest* creates [fastify](https://github.com/fastify/fastify) REST APIs and uses [axios](https://github.com/axios/axios) get requests to communicate from the master process to worker processes.
- *queue* a redis instance and [bee-queue](https://github.com/bee-queue/bee-queue) is used to distribute work to worker processes. With this, worker processes can be created on multiple machines. And using an intermediate queue technology, makes it possible to use some other language than node.js for the stockfish analysis.

## Running
If you have troubles running the project, make sure you have latest version of node.js that supports WebAssembly. Tested with node.js v10.15+. And if you want to run the *queue* strategy, you need to have docker installed, because it creates a redis container to run the *bee-queue* on.

To start the socket server, pick any strategy you want to test out and run: `npm run [strategy]`, e.g. ` npm run single`, `npm run child_process`. This won't output anything to console.

To start the client and send queries, run `npm run client`. After the client starts, you can start sending FEN strings. For example for the game state of: `r3kb1r/p2npppp/2p2n2/3N4/8/5N2/PPPP1PPP/R1B2RK1 b kq - 0 10`, paste it and press enter on the console. You should see:

```
r3kb1r/p2npppp/2p2n2/3N4/8/5N2/PPPP1PPP/R1B2RK1 b kq - 0 10
server says: c6d5
```

## Benchmark
To test the performance of the strategies, you can run `npm run [strategy]:benchmark`, e.g. `npm run child_process:benchmark`. This will run 10.000 analysis requests in parallel to the strategy you chose, and you can see the time it takes. On my machine; *per_call* dies because of OOM, *single* takes approx. 3 minutes, *child_process* takes 20 seconds, and *queue* takes around 30 seconds.
