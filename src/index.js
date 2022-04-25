require('dotenv').config({ path: './environment/dev.env' });
const app = require('./app.js');

const port = process.env.PORT;

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});
