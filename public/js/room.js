// TODO
// Check cell before make turn

const socket = io('/room');

// Elements
const $turnForm = document.getElementById('turn-form');
const $startGameButton = document.getElementById('start-game-btn');
const $makeTurnButton = document.getElementById('turn-btn');
const $turnLabel = document.getElementById('turn-label');
const $leaveRoomButton = document.getElementById('leave-room-btn');
const $field = document.getElementsByClassName('cell');

// Templates
// const infoTemplate = document.getElementById('info-template').innerHTML;
const playersLabelTemplate = document.getElementById('players-label-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

$startGameButton.setAttribute('disabled', 'disabled');
document.getElementById('room-name').innerHTML = room;
$turnLabel.innerHTML = 'Waiting to start game...';

let gameId = null;
//let miniIconSrc = null;
let playersNumber = 0;
let isGameOn = false;
let fieldCells = null;

disableField(true);

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

	console.log('players: ' + playersNumber);
});

socket.on('player:leave', (players) => {
	playersNumber -= 1;
	updatePlayersTable(players);
	resetGame();
});

socket.on('game:start-turn', (activeUser, field) => {
	updateField(field);
	fieldCells = field;

	if (activeUser !== gameId) {
		$turnLabel.innerHTML = 'It`s <b>not</b> your turn!';
		return disableField(true);
	}

	$turnLabel.innerHTML = 'It`s <b>your</b> turn!';
	disableField(false);
});

socket.on('game:start', () => {
	isGameOn = true;

	disableField(false);
	updateStartGameButton();
});

socket.on('game:finish', (res, field) => {
	if (res.id === 0) {
		alert('Draw!');
	} else if (res.id === gameId) {
		alert('You win!');
	} else {
		alert('You lose!');
	}

	updateField(field);
	disableField(true);
	setTimeout(() => {
		resetGame();
	}, 3000);
});

$startGameButton.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('game:start', room);
});

$leaveRoomButton.addEventListener('click', (event) => {
	event.preventDefault();

	window.location = '/';
});

function turn(x, y) {
	const i = (3 - y) * 3 + (x - 1);

	if (fieldCells[i]) {
		return alert('This cell is alredy occupied!');
	}

	socket.emit('game:finish-turn', [x, y], room);
}

function updatePlayersTable(players) {
	const html = Mustache.render(playersLabelTemplate, {
		players,
	});
	document.getElementsByClassName('players-label')[0].innerHTML = html;
}

function updateStartGameButton() {
	if (playersNumber !== 2 || isGameOn) {
		$startGameButton.setAttribute('disabled', 'disabled');
	} else $startGameButton.removeAttribute('disabled');
}

function disableField(state) {
	if (state) {
		for (let cell of $field) {
			cell.setAttribute('disabled', 'disabled');
		}
	} else {
		for (let cell of $field) {
			cell.removeAttribute('disabled');
		}
	}
}

function updateField(field) {
	for (let i = 0; i < 9; i++) {
		if (field[i]) {
			const mark = field[i] === 1 ? 'cross' : 'circle';
			$field[i].classList.add(mark);
		}
	}
}

function resetGame() {
	fieldCells = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	clearField();
	isGameOn = false;
	$turnLabel.innerHTML = 'Waiting to start game...';
	updateStartGameButton();
}

function clearField() {
	for (let cell of $field) {
		cell.classList.remove('cross', 'circle');
	}
}
