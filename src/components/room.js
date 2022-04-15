const { Field } = require('./field.js');
const { User } = require('./user.js');

class Room {
	constructor(name) {
		this._name = name.trim().toLowerCase();
		this._field = new Field();

		this._players = {
			1: null,
			2: null,
		};
		this._playersNumber = 0;

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
			players: this._playersNumber,
		};
	}

	getPlayerGameId(socketId) {
		for (let key in this._players) {
			if (this._players[key].socketId === socketId) return key;
		}
	}

	getPlayersNum() {
		return this._playersNumber;
	}

	getPlayers() {
		return [
			{
				username: this._players[1]?.originalUsername,
			},
			{
				username: this._players[2]?.originalUsername,
			},
		];
	}

	addUser(user) {
		if (this._players[1] !== null && this._players[2] !== null) return { error: 'The room is full' };

		user.room = this._name;
		this._playersNumber += 1;

		if (!this._players[1]) {
			this._players[1] = user;
			return { user, gameId: 1 };
		}

		this._players[2] = user;
		return { user, gameId: 2 };
	}

	removeUser(socketId) {
		for (let key in this._players) {
			if (this._players[key]?.socketId === socketId) {
				this._players[key] = null;
				this._playersNumber -= 1;
				return;
			}
		}

		return { error: 'No such user or the room is empty' };
	}

	startGame() {
		if (this._started) return { error: 'The game is already running' };
		if (this._playersNumber !== 2) return { error: 'Not enough players' };

		this._started = true;
		this._activePlayer = 1;
		return this._activePlayer;
	}

	turn(turn) {
		const [x, y] = turn;

		if (this._field.getCell(x, y)) {
			return { error: 'Cell is taken' };
		}

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

rooms.public = () => {
	return Array.from(rooms.values()).map((room) => room.public);
};

module.exports = { Room, rooms };
