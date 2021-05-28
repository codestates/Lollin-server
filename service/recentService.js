const MongoClient = require('mongodb').MongoClient;
const uri = process.env.Mongdb_url;

const recentChamp = async function (callback) {
	const mongoDB = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mongoDB.connect((err, db) => {
		if (err) callback(err);
		let dbo = db.db('lollin');
		// dbo
		// 	.collection(`champions`)
		// 	.find()
		// 	.sort({ key: -1 })
		// 	.limit(1)
		// 	.toArray((err, result) => {
		// 		callback(err, result);
		// 		db.close();
		// 	});
		dbo
			.collection('champions')
			.find()
			.toArray((err, result) => {
				callback(err, result);
				db.close();
			});
	});
};

module.exports = recentChamp;
