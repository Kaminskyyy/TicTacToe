const { User, users } = require('../components/user.js');
const { rooms } = require('../components/room.js');

module.exports = (io, socket, lobbyNamespace) => {
	socket.on('join', (username, roomName, callback) => {
		try {
			const room = rooms.get(roomName.trim().toLowerCase());

			if (!room) throw new Error('No such room');

			const user = new User(username, socket.id);
			users.set(socket.id, user);

			const player = room.addPlayer(user);

			socket.join(room.name);

			io.to(room.name).emit('player:join', {
				gameId: Number(player.gameId),
				username: user.originalUsername,
				players: room.getPlayers(),
			});

			lobbyNamespace.emit('update:rooms', rooms.public());
			callback();
		} catch (error) {
			return callback(error);
		}
	});

	socket.on('game:start', () => {
		try {
			const room = users.get(socket.id).room;

			if (!room) throw new Error('NO ROOM');

			const activeUser = room.startGame();

			if (activeUser.error) throw new Error(activeUser.error);

			io.to(room.name).emit('game:start');
			io.to(room.name).emit('game:start-turn', activeUser, room.field.flat());
		} catch (error) {
			console.log(error);
		}
	});

	socket.on('game:finish-turn', (turn) => {
		const room = users.get(socket.id).room;

		const res = room.turn(turn);

		if (res.id || res.over) {
			room.swapPlayers();
			io.to(room.name).emit('game:finish', res, room.field.flat(), room.getPlayers());
			return room.resetGame();
		}

		io.to(room.name).emit('game:start-turn', room.active, room.field.flat());
	});

	socket.on('disconnect', () => {
		try {
			const user = users.get(socket.id);
			const room = user.room;
			room.removePlayer(user);
			room.resetGame();

			users.delete(socket.id);

			io.to(room.name).emit('player:leave', room.getPlayers());
			lobbyNamespace.emit('update:rooms', rooms.public());
		} catch (error) {
			console.log(error);
		}
	});
};
