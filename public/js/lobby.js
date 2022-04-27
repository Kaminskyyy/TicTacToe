const socket = io('/lobby', {
	auth: {
		bearer: Cookies.get('bearer'),
	},
});

socket.on('connect_error', (error) => {
	alert(error);
	window.location = '/auth.html';
});

const $usernameForm = document.querySelector('.username-form');
const $usernameInput = $usernameForm.getElementsByTagName('input')[0];
const $createRoomForm = document.querySelector('.create-room-form');
const $createRoomInput = $createRoomForm.getElementsByTagName('input')[0];
const $roomsList = document.getElementById('rooms');
const $invalidUsernamePopup = document.getElementsByClassName('username-popup')[0];
const $invalidRoomNamePopup = document.getElementsByClassName('room-name-popup')[0];

// Templates
const roomsTemplate = document.getElementById('rooms-template').innerHTML;

socket.on('rooms:update', (rooms) => {
	const html = Mustache.render(roomsTemplate, {
		rooms,
	});

	document.getElementById('rooms').innerHTML = html;
});

$createRoomForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const roomName = validateName(new FormData($createRoomForm).get('room'));

	if (!roomName) {
		$invalidRoomNamePopup.removeAttribute('hidden');
		return;
	}

	socket.emit('rooms:create', roomName, (result) => {
		if (result.error) {
			return alert(result.error);
		}
		joinRoom(roomName);
	});
});

$roomsList.addEventListener('click', (event) => {
	event.preventDefault();

	const roomName = event.target.getElementsByClassName('room-name')[0].innerHTML;

	joinRoom(roomName);
});

function joinRoom(roomName) {
	const username = validateName(new FormData($usernameForm).get('username'));

	if (!username) {
		$invalidUsernamePopup.removeAttribute('hidden');
		return;
	}

	socket.emit('rooms:join', roomName, (result) => {
		if (result) {
			socket.close();
			window.location = `/room.html?room=${roomName}&username=${username}`;
			return;
		}
		alert('No such room or the room is full!');
	});
}

$usernameInput.addEventListener('input', (event) => {
	$invalidUsernamePopup.setAttribute('hidden', 'hidden');
});

$createRoomInput.addEventListener('input', (event) => {
	$invalidRoomNamePopup.setAttribute('hidden', 'hidden');
});

function validateName(input) {
	input = input.trim();

	const isValid = validator.isAlphanumeric(input, 'en-US', { ignore: '-_' });

	if (input.length < 5 || input.length > 21 || !isValid) {
		return undefined;
	}

	return input;
}
