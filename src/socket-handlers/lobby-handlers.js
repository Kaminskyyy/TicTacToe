const { Room, rooms } = require('../components/room.js');

module.exports = (io, socket) => {
	socket.emit('update:rooms', rooms.public());

	socket.on('create:room', (roomName, callback) => {
		roomName = roomName.trim().toLowerCase();

		if (rooms.has(roomName)) {
			return callback({ error: 'This room name is taken' });
		}

		const room = new Room(roomName);
		rooms.set(roomName, room);

		io.emit('update:rooms', rooms.public());
		callback(room.public);
	});

	socket.on('disconnect', (reason) => {
		console.log('LOBBY DISCONNNECT');
	});
};
