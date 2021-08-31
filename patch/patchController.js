const router = require('express').Router();
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const getVersion = function (currenctVersion, callback) {
	axios
		.get(`https://ddragon.leagueoflegends.com/api/versions.json`)
		.then((res) => {
			if (currenctVersion !== res.data[0]) {
				patch(res.data[0]);
				callback(res.data[0]);
			}
		});
};
const patch = function (version) {
	axios
		.get(
			`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/item.json`,
		)
		.then((response) => {
			let datas = response.data.data;
			let arr = [];
			for (let index in datas) {
				arr.push(datas[index]);
			}
			insert(arr, 'items');
		})
		.catch((err) => {
			console.log(err);
			console.log('version:', version);
		});
	axios
		.get(
			`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`,
		)
		.then((response) => {
			let datas = response.data.data;
			let arr = [];
			for (let index in datas) {
				arr.push(datas[index]);
			}
			insert(arr, 'champions');
		})
		.catch((err) => {
			console.log(err);
			console.log('version:', version);
		});
};
const insert = function (data, collectionName) {
	const mongoDB = new MongoClient(process.env.Mongdb_url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	mongoDB.connect((err) => {
		const collection = mongoDB.db('lollin').collection(collectionName);

		collection.deleteMany({});
		collection.insertMany(data, (err, res) => {
			if (err) throw err;
			console.log('1 document inserted');
			mongoDB.close();
		});
	});
};

module.exports = getVersion;
