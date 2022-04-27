//const { User, users } = require('../components/user.js');
const { rooms } = require('../components/room.js');

module.exports = (io, socket, lobbyNamespace) => {
	try {
		const player = socket.data.room.addPlayer(socket.data.user);

		socket.join(socket.data.room.name);

		io.to(socket.data.room.name).emit('player:join', {
			gameId: Number(player.gameId),
			username: socket.data.user.originalUsername,
			players: socket.data.room.getPlayers(),
		});

		lobbyNamespace.emit('rooms:update', rooms.public());
	} catch (error) {
		console.log(error);
		//	TODO
		//	Handle errors
	}

	socket.on('game:start', () => {
		try {
			const activeUser = socket.data.room.startGame();

			if (activeUser.error) throw new Error(activeUser.error);

			io.to(socket.data.room.name).emit('game:start');
			io.to(socket.data.room.name).emit('game:start-turn', activeUser, socket.data.room.field.flat());
		} catch (error) {
			console.log(error);
		}
	});

	socket.on('game:finish-turn', (turn) => {
		const room = socket.data.room;

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
			const user = socket.data.user;
			const room = socket.data.room;
			room.removePlayer(user);
			room.resetGame();

			io.to(room.name).emit('player:leave', room.getPlayers());
			lobbyNamespace.emit('rooms:update', rooms.public());
		} catch (error) {
			console.log(error);
		}
	});
};
