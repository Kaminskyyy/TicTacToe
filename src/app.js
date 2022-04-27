require('dotenv').config({ path: './environment/dev.env' });
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

//	Routers
const userRouter = require('./routers/user.js');

// 	Socket
const registerRoomHandlers = require('./socket-handlers/room-handlers.js');
const registerLobbyHandlers = require('./socket-handlers/lobby-handlers.js');
const { authentication } = require('./middleware/socket/auth.js');

//	Database
require('./db/mongoose.js');

// 	Server creation
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 	Express settings
app.use(express.json());
app.use(express.static('./public'));
app.use(userRouter);

const lobbyNamespace = io.of('/lobby');
const roomNamespace = io.of('/room');

lobbyNamespace.use(authentication);
roomNamespace.use(authentication);

roomNamespace.on('connection', (socket) => {
	registerRoomHandlers(roomNamespace, socket, lobbyNamespace);
});

lobbyNamespace.on('connection', (socket) => {
	registerLobbyHandlers(lobbyNamespace, socket);
});

module.exports = server;
