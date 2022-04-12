const socket = io();
// Elements
const $turnForm = document.getElementById('turn-form');
const $startGameButton = document.getElementById('start-game-btn');
const $makeTurnButton = document.getElementById('turn-btn');

const infoTemplate = document.getElementById('info-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
let gameId = null;

socket.emit('joinRoom', username, room, (result) => {
	console.log(result);

	if (result.error) {
		// TODO
		// Bring user back to lobby
	}
});

socket.on('joined', (data) => {
	if (gameId === null && username === data.username) {
		gameId = data.gameId;
	}

	const html = Mustache.render(infoTemplate, {
		roomName: room,
		id: gameId,
		players: data.players,
	});
	document.getElementById('info').innerHTML = html;

	$makeTurnButton.setAttribute('disabled', 'disabled');

	console.log(data.username + ' joined');
	console.log('gameId: ' + gameId);
});

socket.on('startTurn', (activeUser, field) => {
	console.log(field);
	console.log(activeUser);
	console.log(gameId);

	if (activeUser !== gameId) {
		return $makeTurnButton.setAttribute('disabled', 'disabled');
	}

	$makeTurnButton.removeAttribute('disabled');
});

socket.on('finishGame', (res) => {
	if (res.id === 0) {
		alert('Draw!');
	}

	if (res.id === gameId) {
		alert('You win!');
	} else {
		alert('You lose!');
	}

	$makeTurnButton.setAttribute('disabled', 'disabled');
});

$turnForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const turn = new FormData($turnForm).get('turn').split(' ');

	turn[0] = Number(turn[0]);
	turn[1] = Number(turn[1]);

	socket.emit('finishTurn', turn, room);
	console.log('FINISH TURN');
});

$startGameButton.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('startGame', room);
	$makeTurnButton.removeAttribute('disabled');
});
