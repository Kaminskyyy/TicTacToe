const { User } = require('./components/user.js');
const { rooms } = require('./components/room.js');
const { io } = require('./app.js');

io.on('connection', (socket) => {
	console.log('New WebSocket connection');

	socket.on('joinRoom', (username, roomName, callback) => {
		const user = new User(username, socket.id);
		const room = rooms.get(roomName.trim().toLowerCase());

		if (!room) return callback({ error: 'No such room' });

		const result = room.addUser(user);

		if (result.error) {
			return callback({ error: 'The room is full' });
		}

		socket.join(room.name);

		io.to(room.name).emit('joined', {
			gameId: Number(room.getPlayerGameId(socket.id)),
			username: user.originalUsername,
			players: room.getPlayersNum(),
		});

		//console.log(rooms);
		callback(room.getPlayerGameId(socket.id));
	});

	socket.on('startGame', (roomName) => {
		const room = rooms.get(roomName.trim().toLowerCase());

		if (!room) {
			// ERROR
			console.log('NO ROOM');
		}

		const activeUser = room.startGame();

		if (activeUser.error) {
			// ERROR
			console.log(activeUser.error);
		}

		io.to(room.name).emit('startTurn', activeUser, room.field);
	});

	socket.on('leaveRoom', (roomName, callback) => {
		//
	});

	socket.on('finishTurn', (turn, roomName) => {
		const room = rooms.get(roomName.trim().toLowerCase());

		const res = room.turn(turn);

		if (res.id || res.over) {
			room.resetGame();
			return io.to(room.name).emit('finishGame', res);
		}

		io.to(room.name).emit('startTurn', room.active, room.field);
	});

	socket.on('disconnect', () => {
		// delete user from room!
	});
});
