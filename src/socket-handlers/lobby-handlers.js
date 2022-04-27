const { Room, rooms } = require('../components/room.js');
const { User } = require('../components/user.js');

module.exports = (io, socket) => {
	socket.emit('rooms:update', rooms.public());

	socket.on('rooms:create', (roomName, callback) => {
		roomName = roomName.trim().toLowerCase();

		if (rooms.has(roomName)) {
			return callback({ error: 'This room name is taken' });
		}

		const room = new Room(roomName);
		rooms.set(roomName, room);

		io.emit('rooms:update', rooms.public());
		callback(room.public);
	});

	socket.on('rooms:join', (roomName, callback) => {
		const room = rooms.get(roomName.trim().toLowerCase());

		if (!room || room.getPlayersNum() === 2) {
			return callback(false);
		}
		callback(true);
	});

	socket.on('disconnect', (reason) => {
		if (reason === 'transport close') {
			User.users.delete(socket.handshake.bearer);
		}
		console.log('LOBBY DISCONNNECT', reason);
	});
};
