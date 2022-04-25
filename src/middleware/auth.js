const jwt = require('jsonwebtoken');
const User = require('../db/models/user.js');

async function authentication(req, res, next) {
	try {
		const bearer = req.get('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
		const user = User.findOne({ _id: decoded._id, 'tokens.token': bearer });

		if (!user) throw new Error('Unauthorized');

		req.user = user;
		req.bearer = bearer;

		next();
	} catch (error) {
		res.status(401).send({ error });
	}
}

module.exports = { authentication };
