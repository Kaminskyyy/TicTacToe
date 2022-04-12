const options = { cors: true };
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const { router: userRouter } = require('./routers/lobby.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('./public'));
app.use(userRouter);

module.exports = { app, server, io };