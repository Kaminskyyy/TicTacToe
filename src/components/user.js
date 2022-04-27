const db = require('../db/models/user.js');

class User {
	constructor(user) {
		this._dbid = user.dbid;
		this._username = user.username;
	}

	static async findByToken(id, bearer) {
		const user = User.users.get(bearer);

		if (user && user.dbid === id) return { user, bearer };

		const userDocument = await db.User.findOne({ _id: id, 'token.tokens': bearer });

		if (userDocument) {
			const user = new User({
				dbid: userDocument._id.toString(),
				username: userDocument.username,
			});
			User.users.set(bearer, user);

			return { user, bearer };
		}

		return {};
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

	findByDBid(dbid) {
		for (let user of this.values()) {
			console.log(user);

			if (user.dbid === dbid) return user;
		}

		return undefined;
	}
}

const users = new Users();

User.users = users;

module.exports = { User, users };
