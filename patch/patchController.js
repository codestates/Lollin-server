const router = require('express').Router();
const axios = require('axios');
const mongoDB = require('../repository/connectionMongoDB');

const insert = function (data, collectionName) {
	mongoDB.connect((err) => {
		const collection = mongoDB.db('lollin').collection(collectionName);
		collection.insertMany(data, (err, res) => {
			if (err) throw err;
			console.log('1 document inserted');
			mongoDB.close();
		});
	});
};

router.get('/items', (req, res) => {
	mongoDB.conn;
	axios
		.get('http://ddragon.leagueoflegends.com/cdn/11.10.1/data/ko_KR/item.json')
		.then((response) => {
			let datas = response.data.data;
			let arr = [];
			for (let index in datas) {
				arr.push(datas[index]);
			}
			insert(arr, 'items');
			res.send(datas);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err);
		});
});
router.get('/champions', (req, res) => {
	axios
		.get(
			'http://ddragon.leagueoflegends.com/cdn/11.10.1/data/ko_KR/champion.json',
		)
		.then((response) => {
			let datas = response.data.data;
			let arr = [];
			for (let index in datas) {
				arr.push(datas[index]);
			}
			insert(arr, 'champions');
			res.send(datas);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err);
		});
});
module.exports = router;
