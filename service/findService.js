const MongoClient = require('mongodb').MongoClient;
const uri = process.env.Mongdb_url;

const select = async function (collectionName, find, callback) {
	const mongoDB = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mongoDB.connect((err, db) => {
		if (err) callback(err);
		let dbo = db.db('lollin');
		dbo
			.collection(`${collectionName}`)
			.find(find)
			// callback(null, result);
			// db.close();
			.toArray(function (err, result) {
				callback(err, result);
				db.close();
			});
	});
};

module.exports = select;
