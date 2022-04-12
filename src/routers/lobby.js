const { Router } = require('express');
const { Room, rooms } = require('../components/room.js');

const router = new Router();

router.post('/rooms', (req, res) => {
	//console.log(req.body);

	const roomName = req.body.name.trim().toLowerCase();

	if (rooms.has(roomName)) {
		return res.status(400).send({ error: 'This room name is taken' });
	}

	const room = new Room(req.body.name);
	rooms.set(req.body.name, new Room(req.body.name));

	//console.log(rooms);
	res.send(room);
});

router.get('/rooms', (req, res) => {
	res.send({
		rooms: Array.from(rooms.values()),
	});
});

module.exports = { router };
