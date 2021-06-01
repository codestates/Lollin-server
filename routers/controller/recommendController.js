const router = require('express').Router();
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');
router.get('/item', (req, res) => {
	let champ1 = req.query.champ1;
	let champ2 = req.query.champ2;
	//based on platinum tier +
	if (champ1 && champ2) {
		request(
			`https://lol.ps/versus/?champ1=${encodeURI(champ1)}&champ2=${encodeURI(
				champ2,
			)}&version=21&tier=2`,
			(err, response, html) => {
				if (!err && response.statusCode === 200) {
					const $ = cheerio.load(html);
					let itemArr = [];
					for (let i = 1; i < 4; i++) {
						let result = $(
							`#common > div.items > div:nth-child(3) > div > div.img > span:nth-child(${i}) > div`,
						).attr();
						console.log(result);
						if (result) {
							let {
								class: id,
								title: itemName,
								'data-content': itemContent,
							} = result;
							id = id.split(' ')[1].split('_')[2];
							itemArr.push({
								id: id,
								itemName: itemName,
								itemContent: itemContent,
							});
						}
					}
					if (itemArr.length > 0) {
						res.send({ data: itemArr });
					} else {
						res.status(400).send('invalid champion name!');
					}
				} else {
					console.log(err);
					console.log(response.statusCode);
					res.status(400).send(err);
				}
			},
		);
	} else {
		res.status(400).send('please type in correct champion');
	}
});
router.get('/build', (req, res) => {
	let champ1 = req.query.champ1;
	let champ2 = req.query.champ2;
	if (champ1 && champ2) {
		request(
			`https://lol.ps/versus/?champ1=${encodeURI(champ1)}&champ2=${encodeURI(
				champ2,
			)}&version=21&tier=2`,
			(err, response, html) => {
				if (!err && response.statusCode === 200) {
					const $ = cheerio.load(html);
					let runeArr = [];
					let result = $('div.probuild');
					console.log(result.html());
					res.send(result.html());
				} else {
					console.log(err);
					res.status(400).send(err);
				}
			},
		);
	} else {
		res.status(400).send('You should type in champ1 and champ2!');
	}
});
module.exports = router;
