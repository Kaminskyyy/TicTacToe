const socket = io('/room');
// Elements
const $turnForm = document.getElementById('turn-form');
const $startGameButton = document.getElementById('start-game-btn');
const $makeTurnButton = document.getElementById('turn-btn');

const infoTemplate = document.getElementById('info-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
let gameId = null;

socket.emit('join', username, room, (result) => {
	if (result.error) {
		alert(result.error);
		window.location = '/';
	}
});

socket.on('joined', (data) => {
	if (gameId === null && username === data.username) {
		gameId = data.gameId;
	} else alert(data.username + ' joined!');

	const html = Mustache.render(infoTemplate, {
		roomName: room,
		id: gameId,
		players: data.players,
	});
	document.getElementById('info').innerHTML = html;

	$makeTurnButton.setAttribute('disabled', 'disabled');
});

socket.on('startTurn', (activeUser, field) => {
	console.log(field);
	$startGameButton.setAttribute('disabled', 'disabled');

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
	$startGameButton.removeAttribute('disabled');
});

$turnForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const turn = new FormData($turnForm).get('turn').split(' ');

	turn[0] = Number(turn[0]);
	turn[1] = Number(turn[1]);

	socket.emit('finishTurn', turn, room);
});

$startGameButton.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('startGame', room);
	$makeTurnButton.removeAttribute('disabled');
});
