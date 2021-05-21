require('dotenv').config();
const app = require('express')();
const router = require('./routers/router');

app.use('/user', router.userController);
app.use('/champions', router.championsController);
app.use('/items', router.itemsController);
app.use('/utils', router.utilsController);
app.use('/members', router.membersController);

app.use('/patch', require('./patch/patchController'));

app.get('/', (req, res) => {
	res.send('hello world');
});

app.listen(process.env.PORT, () => {
	console.log(`server is listening ${process.env.PORT}`);
});
