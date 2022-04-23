const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/games-app').catch((error) => {
	//  TODO
	//	HANDLE ERRORS
	//
	console.log(error);
});

mongoose.connection.on('connected', () => {
	console.log('DB connected');
});

mongoose.connection.on('error', (error) => {
	//  TODO
	//	HANDLE ERRORS
	//
	console.log(error);
});

mongoose.connection.on('disconnected', () => {
	//  TODO
	//	HANDLE ERRORS
	//
	console.log('DB disconnected');
});
