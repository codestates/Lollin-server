const router = require('express').Router();
const axios = require('axios');
const configGenerator = require('../configGenerator');
const utilRepository = require('../../repository/utilRepository');
const select = require('../../service/findService');
router.get('/activeGame?', (req, res) => {
	axios(configGenerator('userinfo', req.query.name))
		.then((response) => {
			//   console.log('response.data: ');
			//   console.log(response.data);

			axios(configGenerator('activegame', response.data.id))
				.then((result) => {
					//   console.log(result);
					let matchData = result.data;
					let champIds = [];
					let champNames = {};
					let participants = [...matchData.participants];
					matchData.participants.forEach((el) => {
						champIds.push(el.championId.toString());
					});
					console.log(champIds);
					select('champions', { key: { $in: champIds } }, (err, result2) => {
						if (err) {
							res.status(404).send(err);
						} else {
							result2.forEach((champdata) => {
								champNames[champdata.key] = champdata.id;
							});
							for (let participant of participants) {
								participant.championName = champNames[participant.championId];
							}
							console.log(participants);
							matchData.participants = participants;
							res.send(matchData);
							// utilRepository.getScore(req.query.name, matchData, res);
						}
					});
					//평가 분석 API
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
			let matchData = response.data.gameList[0];
			let champIds = [];
			let champNames = {};
			let participants = [...matchData.participants];
			matchData.participants.forEach((el) => {
				champIds.push(el.championId.toString());
			});
			console.log(champIds);
			select('champions', { key: { $in: champIds } }, (err, result) => {
				if (err) {
					res.status(404).send(err);
				} else {
					result.forEach((champdata) => {
						champNames[champdata.key] = champdata.id;
					});
					for (let participant of participants) {
						participant.championName = champNames[participant.championId];
					}
					console.log(participants);
					matchData.participants = participants;
					res.status(200).send(matchData);
				}
			});
		})
		.catch((err) => {
			res.status(404).send(err);
		});
});
//select('champions', { key: { $in: strIds } }, (err, result) => {

module.exports = router;
