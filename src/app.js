const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

// Socket
const registerRoomHandlers = require('./socket-handlers/room-handlers.js');
const registerLobbyHandlers = require('./socket-handlers/lobby-handlers.js');

// Server creation
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Express settings
app.use(express.json());
app.use(express.static('./public'));

const lobbyNamespace = io.of('/lobby');
const roomNamespace = io.of('/room');

roomNamespace.on('connection', (socket) => {
	registerRoomHandlers(roomNamespace, socket, lobbyNamespace);
});

lobbyNamespace.on('connection', (socket) => {
	registerLobbyHandlers(lobbyNamespace, socket);
});

module.exports = { server };
