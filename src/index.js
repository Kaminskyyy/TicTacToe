const options = { cors: true };
const io = require('socket.io')(options);
const { Field } = require('./components/field.js');

const field = new Field();

console.log(field.getField());