const { Router } = require('express');
const User = require('../db/models/user.js');

const router = new Router();

router.post('/users', async (req, res) => {
	try {
		const user = new User({
			...req.body,
		});

		const bearer = await user.createBearer();
		await user.save();

		res.set('Set-Cookie', `bearer=${bearer}`);
		res.send({ user, bearer });
	} catch (error) {
		res.status(400).send({ error });
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email_or_username, req.body.password);

		const bearer = await user.createBearer();

		res.set('Set-Cookie', `bearer=${bearer}`);
		res.send({ user, bearer });
	} catch (error) {
		// 	TODO
		//	Handling different errors
		res.status(400).send({ error });
	}
});

module.exports = router;
