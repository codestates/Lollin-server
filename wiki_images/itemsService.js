const MongoClient = require('mongodb').MongoClient;
const uri = process.env.Mongdb_url;

const selectAll = async function (collectionName, callback) {
  const mongoDB = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoDB.connect((err, db) => {
    if (err) callback(err);
    let dbo = db.db('lollin');
    dbo
      .collection(`${collectionName}`)
      .find({})
      .toArray(function (err, result) {
        callback(err, result);
        db.close();
      });
  });
};

module.exports = selectAll;
