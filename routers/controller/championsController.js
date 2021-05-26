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
router.get('/detail', (req, res) => {
	let champId = req.query.id;
	axios
		.get('https://ddragon.leagueoflegends.com/api/versions.json')
		.then((response) => {
			console.log(response.data[0]);
			return response.data[0];
		})
		.then((version) => {
			console.log('version: ', version);
			console.log('id: ', champId);
			return new Promise((resolve, reject) => {
				axios
					.get(
						`http://ddragon.leagueoflegends.com/cdn/${encodeURI(
							version,
						)}/data/ko_KR/champion/${encodeURI(champId)}.json`,
					)
					.then((response2) => {
						if (response2.data) {
							console.log(response2.data);
							resolve({ champdata: response2.data, version: version });
						} else {
							reject('invalid champion id');
						}
					})
					.catch((err) => {
						console.log('rejected here');
						reject(err);
					});
			});
		})
		.then(({ champdata, version }) => {
			console.log('version: ', version);
			let key = champdata.data[champId].key;
			console.log('key before process: ', key);
			console.log(key.length);
			switch (key.length) {
				case 1: {
					console.log('this is 1');
					key = '000' + key;
					break;
				}
				case 2: {
					console.log('this is 2');
					key = '00' + key;
					break;
				}
				case 3: {
					console.log('this is 3');
					key = '0' + key;
					break;
				}
			}
			console.log('key: ', key);

			let imgs = [
				`http://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champdata.data[champId].passive.image.full}`,
			];

			let skills = champdata.data[champId].spells;
			let passive = { id: champId + 'P', ...champdata.data[champId].passive };
			skills.push(passive);
			for (let i = 0; i < 4; i++) {
				let skillId = champdata.data[champId].spells[i];
				imgs.push(
					`http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${skillId.id}.png`,
				);
			}

			let data = {
				id: champId,
				img: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_0.jpg`,
				skills: skills,
				skillsimg: imgs,
				skillwebm: [
					`https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_P1.webm`,
					`https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_Q1.webm`,
					`https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_W1.webm`,
					`https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_E1.webm`,
					`https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_R1.webm`,
				],
			};
			res.send({ data: data });
		})
		.catch((err) => {
			console.log(err);
			res.status(404).send(err);
		});
	// res.send('detail');
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
