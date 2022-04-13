const socket = io('/room');
// Elements
const $turnForm = document.getElementById('turn-form');
const $startGameButton = document.getElementById('start-game-btn');
const $makeTurnButton = document.getElementById('turn-btn');
const $turnLabel = document.getElementById('turn-label');

const infoTemplate = document.getElementById('info-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

document.getElementById('room-name').innerHTML = room;
$turnLabel.innerHTML = 'Waiting start game...';

let gameId = null;

socket.emit('join', username, room, (result) => {
	if (result.error) {
		alert(result.error);
		window.location = '/';
	}
});

socket.on('joined', (data) => {
	if (gameId === null) {
		gameId = data.gameId;
	} else alert(data.username + ' joined!');

	console.log(data.players);

	const html = Mustache.render(infoTemplate, {
		players: data.players,
	});
	document.getElementById('info').innerHTML = html;

	$makeTurnButton.setAttribute('disabled', 'disabled');
});

socket.on('player:leave', () => {
	//
	//
});

socket.on('game:start-turn', (activeUser, field) => {
	console.log(field);
	$startGameButton.setAttribute('disabled', 'disabled');

	if (activeUser !== gameId) {
		$turnLabel.innerHTML = 'It`s <b>not</b> your turn!';
		return $makeTurnButton.setAttribute('disabled', 'disabled');
	}

	$turnLabel.innerHTML = 'It`s <b>your</b> turn!';
	$makeTurnButton.removeAttribute('disabled');
});

socket.on('game:finish', (res) => {
	if (res.id === 0) {
		alert('Draw!');
	}

	if (res.id === gameId) {
		alert('You win!');
	} else {
		alert('You lose!');
	}

	$turnLabel.innerHTML = 'Waiting start game...';
	$makeTurnButton.setAttribute('disabled', 'disabled');
	$startGameButton.removeAttribute('disabled');
});

$turnForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const turn = new FormData($turnForm).get('turn').split(' ');

	turn[0] = Number(turn[0]);
	turn[1] = Number(turn[1]);

	socket.emit('game:finish-turn', turn, room);
});

$startGameButton.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('game:start', room);
	$makeTurnButton.removeAttribute('disabled');
});
