const { Router } = require('express');
const { User } = require('../db/models/user.js');
const componets = require('../components/user.js');

const router = new Router();

router.post('/users', async (req, res) => {
	try {
		const user = new User({
			...req.body,
		});
		const bearer = await user.createBearer();

		user.save();
		res.send({ user, bearer });
	} catch (error) {
		console.log(error);
		res.status(400).send({ error });
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email_or_username, req.body.password);

		if (componets.User.users.findByDBid(user._id.toString())) {
			return res.status(409).send({ error: 'Session is already running on this account' });
		}

		const bearer = await user.createBearer();

		user.save();
		res.send({ user, bearer });
	} catch (error) {
		console.log(error);
		res.status(400).send({ error });
	}
});

module.exports = router;
