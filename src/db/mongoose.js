const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_STRING).catch((error) => {
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
