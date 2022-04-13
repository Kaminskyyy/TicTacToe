const { User } = require('../components/user.js');
const { rooms } = require('../components/room.js');

const users = new Map();

module.exports = (io, socket, lobbyNamespace) => {
	//
	socket.on('join', (username, roomName, callback) => {
		const user = new User(username, socket.id);
		const room = rooms.get(roomName.trim().toLowerCase());

		if (!room) return callback({ error: 'No such room' });

		const result = room.addUser(user);

		if (result.error) {
			return callback(result.error);
		}

		users.set(socket.id, room);
		socket.join(room.name);

		io.to(room.name).emit('joined', {
			gameId: Number(room.getPlayerGameId(socket.id)),
			username: user.originalUsername,
			players: room.getPlayers(),
		});

		console.log(room.getPlayers());

		callback(room.getPlayerGameId(socket.id));

		lobbyNamespace.emit('update:rooms', rooms.public());
	});

	socket.on('game:start', (roomName) => {
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

		io.to(room.name).emit('game:start-turn', activeUser, room.field);
	});

	socket.on('leaveRoom', (roomName, callback) => {
		//
	});

	socket.on('game:finish-turn', (turn, roomName) => {
		const room = rooms.get(roomName.trim().toLowerCase());

		const res = room.turn(turn);

		if (res.id || res.over) {
			room.resetGame();
			return io.to(room.name).emit('game:finish', res);
		}

		io.to(room.name).emit('game:start-turn', room.active, room.field);
	});

	socket.on('disconnect', () => {
		try {
			const room = users.get(socket.id);
			room.removeUser(socket.id);
			room.resetGame();

			io.to(room.name).emit('player:leave');
			lobbyNamespace.emit('update:rooms', rooms.public());
		} catch (error) {
			console.log(error);
		}
	});
};
