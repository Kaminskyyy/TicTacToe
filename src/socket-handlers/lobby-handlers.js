const { Room, rooms } = require('../components/room.js');
const { User } = require('../components/user.js');
const db = require('../db/models/user.js');

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

	socket.on('disconnect', async (reason) => {
		if (reason !== 'client namespace disconnect') {
			const dbid = User.users.get(socket.handshake.auth.bearer).dbid;
			const user = await db.User.findById(dbid);

			await user.deleteBearer(socket.handshake.auth.bearer);
			User.users.delete(socket.handshake.auth.bearer);
		}
	});
};
