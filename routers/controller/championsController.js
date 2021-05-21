const router = require('express').Router();
const selectAll = require('../../service/readService');
const axios = require('axios');
const configGenerator = require('../configGenerator');

router.get('/all', (req, res) => {
	selectAll('champions', (err, result) => {
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(result);
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
module.exports = router;
