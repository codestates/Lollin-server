const router = require('express').Router();
const axios = require('axios');
const configGenerator = require('../configGenerator');
router.get('/search?', (req, res) => {
	console.log(req.query);
	axios(configGenerator('userinfo', req.query.name))
		.then((response) => {
			console.log('response.data: ');
			console.log(response.data);
			axios(configGenerator('activegame', response.data.id))
				.then((response) => {
					console.log(response);
					res.status(200).send(response.data);
				})
				.catch((err) => {
					console.log(err);
					res.status(404).send({
						message: 'Player is not participating any game',
						err: err,
					});
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err);
		});
});
module.exports = router;
