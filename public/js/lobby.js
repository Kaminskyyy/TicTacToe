const $createUserForm = document.getElementById('create-user-form');
const $joinRoomForm = document.getElementById('join-room-form');
const $createRoomForm = document.getElementById('create-room-form');

// Templates
const roomsTemplate = document.getElementById('rooms-template').innerHTML;

$createRoomForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const form = new FormData($createRoomForm);

	try {
		const response = await fetch('/rooms', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: form.get('room') }),
		});

		const body = await response.json();
		await updateRoomsState();
		console.log(body);
	} catch (error) {
		console.log(error);
	}
});

$joinRoomForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const room = new FormData($joinRoomForm).get('room');
	const username = new FormData($createUserForm).get('username');

	window.location = `/room.html?room=${room}&username=${username}`;
	updateRoomsState();
});

async function updateRoomsState() {
	try {
		const response = await fetch('/rooms');
		let body = await response.json();

		const rooms = body.rooms.map((room) => {
			return {
				name: room._name,
				players: room._playersNumber,
			};
		});

		const html = Mustache.render(roomsTemplate, {
			rooms,
		});

		document.getElementById('rooms').innerHTML = html;
	} catch (error) {
		console.log(error);
	}
}

updateRoomsState().then();
setInterval(updateRoomsState, 3000);
