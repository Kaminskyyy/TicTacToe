// TODO
// Check cell before make turn

const socket = io('/room');

// Elements
const $turnForm = document.getElementById('turn-form');
const $startGameButton = document.getElementById('start-game-btn');
const $makeTurnButton = document.getElementById('turn-btn');
const $turnLabel = document.getElementById('turn-label');
const $leaveRoomButton = document.getElementById('leave-room-btn');

// Templates
const infoTemplate = document.getElementById('info-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

$startGameButton.setAttribute('disabled', 'disabled');
document.getElementById('room-name').innerHTML = room;
$turnLabel.innerHTML = 'Waiting to start game...';

let gameId = null;
let playersNumber = 0;
let isGameOn = false;
let field = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

socket.emit('join', username, room, (result) => {
	if (result.error) {
		alert(result.error);
		window.location = '/';
	}
});

socket.on('player:join', (data) => {
	if (gameId === null) {
		gameId = data.gameId;
	} else alert(data.username + ' joined!');

	console.log(data.players);
	playersNumber = data.players.reduce((num, player) => (player.username ? (num += 1) : num), 0);
	updatePlayersTable(data.players);
	updateStartGameButton();

	$makeTurnButton.setAttribute('disabled', 'disabled');
	console.log('players: ' + playersNumber);
});

socket.on('player:leave', (players) => {
	playersNumber -= 1;
	updatePlayersTable(players);
	updateStartGameButton();
});

socket.on('game:start-turn', (activeUser, field) => {
	console.log(field);

	if (activeUser !== gameId) {
		$turnLabel.innerHTML = 'It`s <b>not</b> your turn!';
		return $makeTurnButton.setAttribute('disabled', 'disabled');
	}

	$turnLabel.innerHTML = 'It`s <b>your</b> turn!';
	$makeTurnButton.removeAttribute('disabled');
});

socket.on('game:start', () => {
	isGameOn = true;
	updateStartGameButton();
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

	isGameOn = false;
	$turnLabel.innerHTML = 'Waiting to start game...';
	$makeTurnButton.setAttribute('disabled', 'disabled');
	updateStartGameButton();
});

$turnForm.addEventListener('submit', (event) => {
	//
	// TODO
	// Check if cell is occipied before make turn

	event.preventDefault();

	const turn = new FormData($turnForm).get('turn').split(' ');

	turn[0] = Number(turn[0]);
	turn[1] = Number(turn[1]);

	socket.emit('game:finish-turn', turn, room);
});

function turn(x, y) {
	socket.emit('game:finish-turn', [x, y], room);
}

$startGameButton.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('game:start', room);
	$makeTurnButton.removeAttribute('disabled');
});

$leaveRoomButton.addEventListener('click', (event) => {
	event.preventDefault();

	window.location = '/';
});

function updatePlayersTable(players) {
	const html = Mustache.render(infoTemplate, {
		players,
	});
	document.getElementById('info').innerHTML = html;
}

function updateStartGameButton() {
	if (playersNumber !== 2 || isGameOn) {
		$startGameButton.setAttribute('disabled', 'disabled');
	} else $startGameButton.removeAttribute('disabled');
}
