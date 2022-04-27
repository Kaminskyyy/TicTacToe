const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const statsSchema = require('./statistics.js');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate(value) {
			let isValid = validator.isAlphanumeric(value, 'en-US', { ignore: '-_' });
			isValid = isValid && 4 <= value.length && value.length <= 20;
			if (!isValid) throw new Error('Invalid username!');
		},
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) throw new Error('Invalid email!');
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	game_stats: {
		type: statsSchema,
		required: true,
		default: {},
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

userSchema.static('findByCredentials', async (emailOrUsername, password) => {
	let query = validator.isEmail(emailOrUsername) ? 'email' : 'username';

	const user = await User.findOne({ [query]: emailOrUsername });

	if (!user) throw new Error('Invalid email or username');

	const isValidPassword = await bcrypt.compare(password, user.password);

	if (!isValidPassword) throw new Error('Invalid password');

	return user;
});

userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

userSchema.method('toJSON', function () {
	const user = this.toObject();

	delete user.password;
	delete user.tokens;

	return user;
});

userSchema.method('createBearer', async function () {
	const user = this;

	const bearer = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
	user.tokens.push({ token: bearer });

	await user.save();

	return bearer;
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
