const mongoDB = require('../repository/connectionMongoDB');

const selectAll = function (collectionName, callback) {
  mongoDB.connect((err, db) => {
    if (err) callback(err);
    let dbo = db.db('lollin');
    dbo
      .collection(`${collectionName}`)
      .find({})
      .toArray(function (err, result) {
        callback(err, result);
        //db.close();
      });
  });
};

module.exports = selectAll;
