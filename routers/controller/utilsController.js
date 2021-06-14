const router = require('express').Router();
const axios = require('axios');
const configGenerator = require('../configGenerator');
const utilRepository = require('../../repository/utilRepository');
const select = require('../../service/findService');
const request = require('request');
const cheerio = require('cheerio');
router.get('/activeGame?', (req, res) => {
	axios(configGenerator('userinfo', req.query.name))
		.then((response) => {
			axios(configGenerator('activegame', response.data.id))
				.then((result) => {
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
						}
					});
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
	console.log('query.name: ');
	console.log(summonerName);
	//@@@@@@@@@@@@@@@@@@@@@@@@@league
	axios(configGenerator('userinfo', summonerName))
		.then((responseUser) => {
			userData = responseUser.data;
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
						myData.lane = participant.individualPosition;
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
				getMatchRecursive(
					matchIdList,
					summonerName,
					callback,
					index + 1,
					result,
				);
			});
	} else {
		callback(null, result);
	}
}
router.get('/lightInfo', (req, res) => {
	let summonerName = req.query.name;
	axios(configGenerator('userinfo', summonerName))
		.then((resUserInfo) => {
			let userInfo = resUserInfo.data;
			return new Promise((resolve, reject) => {
				axios(configGenerator('league', userInfo.id))
					.then((resLeague) => {
						resolve(resLeague.data);
					})
					.catch((err) => {
						reject(err);
					});
			});
		})
		.then((leagueInfo) => {
			res.send(leagueInfo);
		})
		.catch((err) => {
			res.status(404).send(err);
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
	console.log('this is featured');
	axios(configGenerator('featured'))
		.then((response) => {
			let matchData = response.data.gameList[0];
			let champIds = [];
			let champNames = {};
			let participants = [...matchData.participants];
			matchData.participants.forEach((el) => {
				champIds.push(el.championId.toString());
			});
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
					matchData.participants = participants;
					res.status(200).send(matchData);
				}
			});
		})
		.catch((err) => {
			res.status(404).send(err);
		});
});
router.get('/patchnote', (req, res) => {
	axios(configGenerator('version'))
		.then((resVersion) => {
			console.log(resVersion);
			let version = resVersion.data[0];
			let firstNum = version.split('.')[0];
			let secondNum = version.split('.')[1];
			return new Promise((resolve, reject) => {
				request(
					configGenerator('patchnote', {
						firstNum: firstNum,
						secondNum: secondNum,
					}),
					(err, response, html) => {
						if (!err && response.statusCode === 200) {
							resolve(html);
						} else {
							reject(err);
						}
					},
				);
			});
		})
		.then((html) => {
			const $ = cheerio.load(html);
			let patchHighlight = $('a.cboxElement');
			let url = patchHighlight.attr('href');
			console.log(url);
			res.send(url);
		})
		.catch((err) => {
			res.send(err);
		});
});
module.exports = router;
