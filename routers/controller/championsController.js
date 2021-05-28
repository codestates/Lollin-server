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
	//@@@@@@@@@@@@@@@@@
	let champId = req.query.id;
	axios
		.get('https://ddragon.leagueoflegends.com/api/versions.json')
		.then((response) => {
			return response.data[0];
		})
		.then((version) => {
			return new Promise((resolve, reject) => {
				axios
					.get(
						`http://ddragon.leagueoflegends.com/cdn/${encodeURI(
							version,
						)}/data/ko_KR/champion/${encodeURI(champId)}.json`,
					)
					.then((response2) => {
						if (response2.data) {
							resolve({ champdata: response2.data, version: version });
						} else {
							reject('invalid champion id');
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		})
		.then(({ champdata, version }) => {
			let key = champdata.data[champId].key;
			switch (key.length) {
				case 1: {
					key = '000' + key;
					break;
				}
				case 2: {
					key = '00' + key;
					break;
				}
				case 3: {
					key = '0' + key;
					break;
				}
			}

			let imgs = [
				`http://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champdata.data[champId].passive.image.full}`,
			];

			let passive = { id: champId + 'P', ...champdata.data[champId].passive };
			let skills = [passive, ...champdata.data[champId].spells];
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
				lore: champdata.data[champId].lore,
				allytips: champdata.data[champId].allytips,
				enemytips: champdata.data[champId].enemytips,
				tags: champdata.data[champId].tags,
			};
			console.log(data);
			console.log(champId);
			console.log(version);
			res.send({ data: data });
		})
		.catch((err) => {
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
