require('dotenv').config();
const app = require('express')();
const router = require('./routers/router');
const axios = require('axios');
const express = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const patch = require('./patch/patchController');
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/user', router.userController);
app.use('/champions', router.championsController);
app.use('/items', router.itemsController);
app.use('/utils', router.utilsController);
app.use('/members', router.membersController);
app.use('/recommend', router.recommendController);
app.use('/auth', router.authContorller);

let currentVersion = fs.readFileSync('./dataVersion.txt').toString();

setInterval(() => {
	patch(currentVersion, (version) => {
		currentVersion = version;
		fs.writeFileSync('./dataVersion.txt', version);
		console.log('patch occured, Current version: ' + currentVersion);
	});
}, 3600000);
//3600000
app.get('/', (req, res) => {
	let buffer = fs.readFileSync('./dataVersion.txt');
	res.send('current version is : ' + buffer.toString());
});

app.listen(process.env.PORT, () => {
	console.log(`server is listening ${process.env.PORT}`);
});
