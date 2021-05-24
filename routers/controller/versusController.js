const router = require('express').Router();
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
router.get('/versus', (req, res) => {
	let champ1 = req.query.champ1;
	let champ2 = req.query.champ2;
	//based on platinum tier +
	request(
		`https://lol.ps/versus/?champ1=${encodeURI(champ1)}&champ2=${encodeURI(
			champ2,
		)}&version=21&tier=2`,
		(err, response, html) => {
			if (!err && response.statusCode === 200) {
				const $ = cheerio.load(html);
				let itemArr = [];
				for (let i = 1; i < 4; i++) {
					let {
						class: id,
						title: itemName,
						'data-content': itemContent,
					} = $(
						`#common > div.items > div:nth-child(3) > div > div.img > span:nth-child(${i}) > div`,
					).attr();
					id = id.split(' ')[1].split('_')[2];
					itemArr.push({
						id: id,
						itemName: itemName,
						itemContent: itemContent,
					});
					// let itemContent = itemElement.attr('data-content')
					// let itemName = itemElement.attr('data-original-title')
					// let itemId = itemElement.attr()
				}
				console.log('item Arr: ');
				console.log(itemArr);
				res.send({ data: itemArr });
			} else {
				console.log(err);
				console.log(response.statusCode);
				res.status(500).send(err);
			}
		},
	);
});
module.exports = router;
