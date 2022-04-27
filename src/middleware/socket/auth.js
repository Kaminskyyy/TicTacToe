const jwt = require('jsonwebtoken');
const { User } = require('../../components/user.js');

async function authentication(socket, next) {
	try {
		console.log('AUTH START');
		const bearer = socket.handshake.auth.bearer;

		const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
		const user = await User.findByToken(decoded._id, bearer);

		if (!user) throw new Error('Unauthorized');

		// console.log('socket middleware\n' + bearer);
		// console.log(User.users);
		next();
	} catch (error) {
		console.log(error.message);
		console.log(error.stack);
		next(error);
	}
}

module.exports = { authentication };
