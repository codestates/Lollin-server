const router = require('express').Router();
const selectAll = require('../../service/readService');
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
router.get('/all', (req, res) => {
	selectAll('items', (err, result) => {
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(result);
	});
});
function pushItems(item, arr = []) {
	let currentItem = item.nextAll();
	arr.push(currentItem);
	if (currentItem.nextAll().attr('class') !== 'header-primary') {
		return pushItems(currentItem, arr);
	} else {
		return arr;
	}
}
router.get('/patched', (req, res) => {
	axios
		.get('https://ddragon.leagueoflegends.com/api/versions.json')
		.then((response) => {
			let currentV = response.data[0];
			let arr = currentV.split('.');
			let fisrtNum = arr[0];
			let secondNum = arr[1];
			request(
				`https://kr.leagueoflegends.com/ko-kr/news/game-updates/patch-${fisrtNum}-${secondNum}-notes/`,
				(err, response, html) => {
					if (!err && response.statusCode === 200) {
						const $ = cheerio.load(html);
						let patchItemsHeader = $('#patch-items').parent();
						let arr = pushItems(patchItemsHeader);
						let items = [];

						for (let i = 0; i < arr.length; i++) {
							let item = arr[i].find('h3:eq(0)').text();
							let explain = arr[i].find('blockquote:eq(0)');
							let contentNum = explain.nextAll('.attribute-change').length;
							let contents = [];
							for (let j = 0; j < contentNum; j++) {
								let str = arr[i]
									.find(`.attribute-change:eq(${j})`)
									.text()
									.replace(/[\r\n\t]/g, '');
								contents.push(str);
							}
							let img = arr[i].find('img:eq(0)').attr('src');
							items.push({
								item: item,
								explain: explain.text().replace(/[\r\n\t]/g, ''),
								contents: contents,
								img: img,
							});
						}
						res.send({ data: items });
					} else {
						res.status(501).send(err);
					}
				},
			);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});
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
