const validator = require('validator');
const mongoose = require('mongoose');

const statsSchema = mongoose.Schema({
	tatal_matches: {},
	total_wins: {},
	total_losses: {},
	hours_played: {},
});

module.exports = statsSchema;