const validator = require('validator');
const mongoose = require('mongoose');

const statsSchema = mongoose.Schema({
	tatal_matches: {
		type: Number,
		required: true,
		default: 0,
	},
	total_wins: {
		type: Number,
		required: true,
		default: 0,
	},
	total_losses: {
		type: Number,
		required: true,
		default: 0,
	},
	hours_played: {
		type: Number,
		required: true,
		default: 0,
	},
});

module.exports = statsSchema;
