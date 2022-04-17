const socket = io('/lobby');

const $usernameForm = document.querySelector('.username-form');
const $usernameInput = $usernameForm.getElementsByTagName('input')[0];
const $createRoomForm = document.querySelector('.create-room-form');
const $roomsList = document.getElementById('rooms');
const $emptyUsernamePopup = document.getElementsByClassName('empty-username-popup')[0];

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

	const roomName = new FormData($createRoomForm).get('room');

	socket.emit('create:room', roomName, (result) => {
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
	const username = new FormData($usernameForm).get('username');

	if (!username) {
		$emptyUsernamePopup.removeAttribute('hidden');
		return;
	}

	socket.emit('check-room', roomName, (result) => {
		if (result) {
			window.location = `/room.html?room=${roomName}&username=${username}`;
			return;
		}
		alert('No such room or the room is full!');
	});
}

$usernameInput.addEventListener('input', (event) => {
	$emptyUsernamePopup.setAttribute('hidden', 'hidden');
});
