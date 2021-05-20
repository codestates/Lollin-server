require('dotenv').config();
const app = require('express')();
const router = require('./routers/router');
const axios = require('axios');
const express = require('body-parser');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/user', router.userController);
app.use('/champions', router.championsController);
app.use('/items', router.itemsController);
app.use('/utils', router.utilsController);
app.use('/members', router.membersController);

let currentVersion;

axios
  .get('https://ddragon.leagueoflegends.com/api/versions.json')
  .then((res) => {
    currentVersion = res.data[0];
  })
  .then(() => {
    setInterval(() => {
      require('./patch/patchController')(currentVersion, (version) => {
        currentVersion = version;
        console.log('patch occured, Current version: ' + currentVersion);
      });
    }, 3600000);
  });

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(process.env.PORT, () => {
  console.log(`server is listening ${process.env.PORT}`);
});
