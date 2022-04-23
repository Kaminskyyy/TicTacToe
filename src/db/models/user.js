const validator = require('validator');
const mongoose = require('mongoose');
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
		minlength: 6,
		validate(value) {
			//	TODO
			//	Ensure that given value is JWT
			//
		},
	},
	game_stastic: {
		type: statsSchema,
		required: true,
	},
});
