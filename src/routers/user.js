const { Router } = require('express');

const router = new Router();

router.post('/users', async (req, res) => {
	//	TODO
	//	1. Validate
	// 	2. Save in the db
	// 	3. Create and send back to the client bearer token

	res.send();
});

router.post('/users/login', async (req, res) => {
	//	TODO
	// 	Create and send back to the client bearer token
});

module.exports = router;
