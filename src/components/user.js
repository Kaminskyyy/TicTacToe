const db = require('../db/models/user.js');

class User {
	constructor(user) {
		this._dbid = user.dbid;
		this._username = user.username;
	}

	static async findByCredentials(emailOrUsername, password) {
		const userDocument = await db.User.findByCredentials(emailOrUsername, password);

		const user = new User({
			dbid: userDocument._id,
			username: userDocument.username,
		});
		const bearer = await userDocument.createBearer();

		await userDocument.save();
		User.users.set(bearer, user);

		return { user, bearer };
	}

	static async findByToken(id, bearer) {
		const user = User.users.get(bearer);

		if (user && user.dbid === id) return { user, bearer };

		const userDocument = await db.User.findOne({ _id: id, 'token.tokens': bearer });

		//console.log(userDocument);

		if (userDocument) {
			const user = new User({
				dbid: userDocument._id,
				username: userDocument.username,
			});
			User.users.set(bearer, user);

			return { user, bearer };
		}

		return undefined;
	}

	static async create(newUser) {
		const userDocument = new db.User({
			...newUser,
		});

		const user = new User({
			dbid: userDocument._id,
			username: userDocument.username,
		});
		const bearer = await userDocument.createBearer();

		await userDocument.save();
		User.users.set(bearer, user);

		return { user, bearer };
	}

	get dbid() {
		return this._dbid;
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
			dbid: this._dbid,
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

	devInfo() {
		const users = Array.from(this.values());
		return users.map((user) => user.devInfo());
	}
}

const users = new Users();

User.users = users;

module.exports = { User, users };
