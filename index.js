express = require('express');
require('dotenv').config();
const app = express();
app.get('/', (req, res) => {
	res.send('hello world');
});

app.listen(process.env.PORT, () => {
	console.log(`server is listening ${process.env.PORT}`);
});
