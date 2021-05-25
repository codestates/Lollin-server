const userController = require('./controller/userController.js');
const itemsController = require('./controller/itemsController');
const championsController = require('./controller/championsController');
const utilsController = require('./controller/utilsController');
const membersController = require('./controller/membersController');
const authContorller = require('./controller/authController');

const routes = {
  userController: userController,
  itemsController: itemsController,
  championsController: championsController,
  utilsController: utilsController,
  membersController: membersController,
  authContorller: authContorller,
};
module.exports = routes;
