const router = require('express').Router();
const axios = require('axios');
const configGenerator = require('../configGenerator');
const utilRepository = require('../../repository/utilRepository');
router.get('/search?', (req, res) => {
	//   console.log(req.query);
	axios(configGenerator('userinfo', req.query.name))
		.then((response) => {
			//   console.log('response.data: ');
			//   console.log(response.data);

			axios(configGenerator('activegame', response.data.id))
				.then((result) => {
					//   console.log(result);
					//평가 분석 API
					utilRepository.getScore(req.query.name, result, res);
					//res.status(200).send(result.data);
				})
				.catch((err) => {
					//   console.log(err);
					res.status(404).send({
						message: 'Player is not participating any game',
						err: err,
					});
				});
		})
		.catch((err) => {
			//   console.log(err);
			res.status(500).send(err);
		});
});
router.get('/rotation', (req, res) => {
	axios(configGenerator('rotation'))
		.then((response) => {
			res.status(200).send(response.data);
		})
		.catch((err) => {
			res.status(404).send(err);
		});
});
router.get('/featured', (req, res) => {
	axios(configGenerator('featured'))
		.then((response) => {
			res.status(200).send(response.data);
		})
		.catch((err) => {
			res.status(404).send(err);
		});
});
module.exports = router;
