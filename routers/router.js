const userController = require('./controller/userController.js');
const itemsController = require('./controller/itemsController');
const championsController = require('./controller/championsController');
const utilsController = require('./controller/utilsController');
const membersController = require('./controller/membersController');
const versusController = require('./controller/versusController');
let routes = {
	userController: userController,
	itemsController: itemsController,
	championsController: championsController,
	utilsController: utilsController,
	membersController: membersController,
	versusController: versusController,
};
module.exports = routes;
