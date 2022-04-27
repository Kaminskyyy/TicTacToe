const { Router } = require('express');
//const User = require('../db/models/user.js');
const { User } = require('../components/user.js');

const router = new Router();

router.post('/users', async (req, res) => {
	try {
		const { user, bearer } = await User.create(req.body);

		res.cookie('bearer', bearer, { path: '/' });
		res.send({ user, bearer });
		console.log(User.users);
	} catch (error) {
		console.log(error);
		res.status(400).send({ error });
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const { user, bearer } = await User.findByCredentials(req.body.email_or_username, req.body.password);

		res.cookie('bearer', bearer, { path: '/' });
		res.send({ user, bearer });

		console.log(User.users);
	} catch (error) {
		// 	TODO
		//	Handling different errors
		res.status(400).send({ error });
	}
});

module.exports = router;
