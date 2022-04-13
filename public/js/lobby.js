const socket = io('/lobby');

const $createUserForm = document.getElementById('create-user-form');
const $joinRoomForm = document.getElementById('join-room-form');
const $createRoomForm = document.getElementById('create-room-form');

// Templates
const roomsTemplate = document.getElementById('rooms-template').innerHTML;

socket.on('update:rooms', (rooms) => {
	const html = Mustache.render(roomsTemplate, {
		rooms,
	});

	document.getElementById('rooms').innerHTML = html;
});

$createRoomForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const form = new FormData($createRoomForm);

	socket.emit('create:room', form.get('room'), (result) => {
		if (result.error) {
			return alert(result.error);
		}
	});
});

$joinRoomForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const room = new FormData($joinRoomForm).get('room');
	const username = new FormData($createUserForm).get('username');

	window.location = `/room.html?room=${room}&username=${username}`;
});
