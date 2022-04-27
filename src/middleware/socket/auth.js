const jwt = require('jsonwebtoken');
const { User } = require('../../components/user.js');
const { rooms } = require('../../components/room.js');

async function lobbyAuth(socket, next) {
	try {
		const bearer = socket.handshake.auth.bearer;

		const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
		const user = await User.findByToken(decoded._id, bearer);

		if (!user) throw new Error('Unauthorized');

		next();
	} catch (error) {
		console.log(error.message);
		console.log(error.stack);
		next(error);
	}
}

async function roomAuth(socket, next) {
	try {
		const bearer = socket.handshake.auth.bearer;
		const roomName = socket.handshake.query.room.trim().toLowerCase();

		const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
		const { user } = await User.findByToken(decoded._id, bearer);

		if (!user) throw new Error('Unauthorized');

		const room = rooms.get(roomName);

		if (!room) throw new Error('Room not find');

		socket.data.room = room;
		socket.data.user = user;

		next();
	} catch (error) {
		console.log(error.message);
		console.log(error.stack);
		next(error);
	}
}

module.exports = { lobbyAuth, roomAuth };
