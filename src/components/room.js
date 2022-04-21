const { Field } = require('./field.js');
const { User } = require('./user.js');

class Room {
	constructor(name) {
		this._name = name.trim().toLowerCase();
		this._field = new Field();

		this._players = [];

		this._started = false;
		this._gameOver = false;
		this._activePlayer = null;
	}

	get field() {
		return this._field.getField();
	}

	get active() {
		return this._activePlayer;
	}

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name.trim().toLowerCase();
	}

	get public() {
		return {
			name: this._name,
			players: this._players.length,
		};
	}

	getGameId(player) {
		return this._players.indexOf(player) + 1;
	}

	getPlayersNum() {
		return this._players.length;
	}

	getPlayers() {
		return this._players.map((player) => {
			return {
				username: player.originalUsername,
				gameId: this.getGameId(player),
			};
		});
	}

	addPlayer(player) {
		if (this._players.length === 2) throw new Error('The room is full');

		player.room = this;
		player.roomName = this.name;

		this._players.push(player);
		return { player, gameId: this.getGameId(player) };
	}

	removePlayer(player) {
		const index = this._players.indexOf(player);

		if (index === -1) throw new Error('No such user or the room is empty');

		return this._players.splice(index, 1);
	}

	swapPlayers() {
		if (this.getPlayersNum() !== 2) throw new Error('Number of players must be 2!');

		const [plOne, plTwo] = this._players;
		this._players[0] = plTwo;
		this._players[1] = plOne;
	}

	startGame() {
		if (this._started) throw new Error('The game is already running');
		if (this.getPlayersNum() !== 2) throw new Error('Not enough players');

		this._started = true;
		this._activePlayer = 1;
		return this._activePlayer;
	}

	turn(turn) {
		const [x, y] = turn;

		if (this._field.getCell(x, y)) throw new Error('Cell is taken');

		this._field.setCell(x, y, this._activePlayer);

		const res = this._field.checkGameOver(this._activePlayer);

		if (res.id || res.over) {
			this._gameOver = true;
			return res;
		}

		this._activePlayer = 3 - this._activePlayer;

		return res;
	}

	resetGame() {
		this._started = false;
		this._gameOver = false;
		this._field.resetField();
	}
}

const rooms = new Map();

for (let i = 0; i < 10; i++) {
	const roomName = 'room-' + i;
	const room = new Room(roomName);
	rooms.set(roomName, room);
}

rooms.public = () => {
	return Array.from(rooms.values()).map((room) => room.public);
};

module.exports = { Room, rooms };
