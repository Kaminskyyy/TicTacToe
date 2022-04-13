//const options = { cors: true };
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

// Socket
const registerRoomHandlers = require('./socket-handlers/room-handler.js');
const registerLobbyHandlers = require('./socket-handlers/lobby-handlers.js');

// Server creation
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Express settings
app.use(express.json());
app.use(express.static('./public'));
//app.use(userRouter);

const lobbyNamespace = io.of('/lobby');
const roomNamespace = io.of('/room');

roomNamespace.on('connection', (socket) => {
	registerRoomHandlers(roomNamespace, socket, lobbyNamespace);
	//
	console.log('ROOM CONNECTION');
});

lobbyNamespace.on('connection', (socket) => {
	registerLobbyHandlers(lobbyNamespace, socket);
	//
	console.log('LOBBY CONNECTION');
});

module.exports = { server };
