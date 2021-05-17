const router = require('express').Router();
const axios = require('axios');
router.get('/', (req, res) => {
	axios
		.get(
			'http://ddragon.leagueoflegends.com/cdn/11.10.1/data/ko_KR/champion.json',
		)
		.then((response) => {
			console.log(response.data);
			let data = response.data;
			res.send(data);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err);
		});
});
module.exports = router;
