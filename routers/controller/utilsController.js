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
router.get('/history', (req, res) => {
	let summonerName = req.query.name;
	let useData;
	let result = {};
	console.log(summonerName);
	//@@@@@@@@@@@@@@@@@@@@@@@@@league
	axios(configGenerator('userinfo', summonerName))
		.then((responseUser) => {
			userData = responseUser.data;
			// {
			// 	"id": "vj052uluJBGr0T98C6NQulIiG7LdV1Nq7uaU1Gios_4s0aE",
			// 	"accountId": "UeDOp-F8f2bQGD_11wlpFeti3AIzN8KhmWfUnD9j2AfCNYI",
			// 	"puuid": "tPQWbTJkAmMfsIUara4UToRI1ojidzJ7Ck423IclNfUzXlMaBRXuAGL4U5iECxbSU2lVvUiBA68g-w",
			// 	"name": "꼬우면15서렌쳐",
			// 	"profileIconId": 4881,
			// 	"revisionDate": 1621889064000,
			// 	"summonerLevel": 330
			//   }
			console.log('user Data: ');
			console.log(userData);
			return new Promise(function (resolve, reject) {
				axios(configGenerator('league', userData.id))
					.then((league) => {
						resolve(league);
					})
					.catch((err) => {
						reject(err);
					});
			});
		})
		.then((league) => {
			let league_solo = league.data[0];
			let league_flex = league.data[1];
			result.league_solo = league_solo;
			result.league_flex = league_flex;
			return new Promise(function (resolve, reject) {
				axios(configGenerator('matchList', userData.puuid))
					.then((matchList) => {
						resolve(matchList);
					})
					.catch((err) => {
						reject(err);
					});
			});
		})
		.then((resmatchList) => {
			let matchIdList = resmatchList.data;
			result.matchList = matchIdList;
			let matches = [];
			return new Promise(function (resolve, reject) {
				getMatchRecursive(matchIdList, summonerName, (err, matches) => {
					if (err) {
						reject(err);
					} else {
						let wins = 0;
						let loses = 0;
						matches.forEach((match) => {
							match.win ? wins++ : loses++;
						});
						let winRate = wins / (wins + loses);
						result.wins = wins;
						result.loses = loses;
						result.winRate = winRate;
						result.matches = matches;
						resolve(result);
					}
				});
			});
		})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.send(err);
		});
});
function getMatchRecursive(
	matchIdList,
	summonerName,
	callback,
	index = 0,
	result = [],
) {
	if (matchIdList.length > index) {
		console.log('recursive index: ', index);
		axios(configGenerator('match', matchIdList[index]))
			.then((match) => {
				let matchData = match.data.info;
				let myData = {};
				myData.matchId = match.data.metadata.matchId;
				myData.gameMode = matchData.gameMode;
				myData.gameType = matchData.gameType;
				myData.creationTime = matchData.gameCreation;
				myData.durationTime = matchData.gameDuration;
				matchData.participants.forEach((participant) => {
					if (participant.summonerName === summonerName) {
						let kda =
							(participant.kills + participant.assists) / participant.deaths;
						let processedKda = Math.floor(kda * 100) / 100;
						myData.kda = processedKda;
						myData.win = participant.win;
						myData.championName = participant.championName;
						myData.championId = participant.championId;
						myData.lane = participant.lane;
						myData.doubleKills = participant.doubleKills;
						myData.tripleKills = participant.tripleKills;
						myData.quadraKills = participant.quadraKills;
						myData.pentaKills = participant.pentaKills;
					}
				});
				result.push(myData);
				getMatchRecursive(
					matchIdList,
					summonerName,
					callback,
					index + 1,
					result,
				);
			})
			.catch((err) => {
				callback(err, result);
			});
	} else {
		console.log('recursive end. result: ');
		console.log(result);
		callback(null, result);
	}
}
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

module.exports = router;
