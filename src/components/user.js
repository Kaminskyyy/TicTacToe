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

	set roomName(room) {
		this._roomName = room?.trim().toLowerCase();
	}

	get roomName() {
		return this._roomName;
	}

	set room(room) {
		this._room = room;
	}

	get room() {
		return this._room;
	}

	getPublic() {
		return {
			name: this.originalUsername,
		};
	}

	devInfo() {
		return {
			username: this._username,
			socketId: this._socketId,
			roomName: this._roomName,
			room: this._room,
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

	devInfo() {
		const users = Array.from(this.values());
		return users.map((user) => user.devInfo());
	}
}

const users = new Users();

module.exports = { User, users };
