express = require('express');
const app = express();
app.get('/', (req, res) => {
	res.send('hello world');
});

app.listen(4000, () => {
	console.log('server is listening 4000');
});
