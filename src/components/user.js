class User {
	constructor(username, socketId) {
		this._username = username.trim();
		this.socketId = socketId;
	}

	get originalUsername() {
		return this._username;
	}

	get username() {
		return this._username.toLowerCase();
	}

	get socketId() {
		return this._socketId;
	}

	set socketId(id) {
		this._socketId = id;
	}

	set room(room) {
		this._room = room?.trim().toLowerCase();
		console.log(this._room);
	}

	get room() {
		return this._room;
	}

	getUser() {
		return {
			username: this.username,
			originalUsername: this.originalUsername,
			gameId: this.gameId,
			socketId: this.socketId,
		};
	}
}

class Users extends Map {
	constructor() {
		super();
	}

	set(key, value) {
		let existingUser = false;

		for (let user of this.values()) {
			if (user.username === value.username) existingUser = true;
		}

		existingUser = existingUser || this.has(key);

		if (existingUser) {
			return {
				error: 'Username is in use!',
			};
		}

		super.set(key, value);
		return value;
	}
}

// const users = new Users();

// users.set(22, new User('Kaminsky', 22));
// users.set(33, new User('WhiteSpot', 33));
// users.set(44, new User('YarushaOnFire', 44));

// console.log(users);

// users.delete(33);

// console.log(users);

module.exports = { User, Users };