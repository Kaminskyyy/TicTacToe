const readline = require('readline');
const yargs = require('yargs');
const { rooms, Room } = require('../components/room.js');
const { users } = require('../components/user.js');

const cl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '>>>  ',
});

cl.on('line', (line) => {
	yargs
		.fail((msg) => {
			console.log(msg);
		})
		.parse(line);
});

yargs.command(
	'rooms <operation> <room>',
	'',
	(yargs) => {
		yargs.positional('operation', {
			choices: ['add', 'delete', 'all', 'get'],
		});
		yargs.coerce('room', (room) => {
			return String(room);
		});
	},
	(argv) => {
		const room = argv.room?.trim().toLowerCase();
		switch (argv.operation) {
			case 'add':
				if (!room) return console.log('Room name required!');

				rooms.set(room, new Room(room));
				break;

			case 'delete':
				if (!room) return console.log('Room name required!');

				rooms.delete(room);
				break;

			case 'all':
				console.log(rooms.devInfo());

				break;
			case 'get':
				if (!room) return console.log('Room name required!');

				console.log(rooms.get(room).devInfo());
				break;
			default:
				break;
		}
	}
);

yargs.command(
	'users <operation> <name>',
	'',
	(yargs) => {},
	(argv) => {
		const user = argv.name?.trim().toLowerCase();

		switch (argv.operation) {
			case 'all':
				console.log(users.devInfo());

				break;

			default:
				break;
		}
	}
);
