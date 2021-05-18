const mongoDB = require('../repository/connectionMongoDB');

const insert = function (data) {
  mongoDB.connect((err) => {
    const collection = mongoDB.db('lollin').collection('test');
    collection.insertMany(data, (err, res) => {
      if (err) throw err;
      console.log('1 document inserted');
      mongoDB.close();
    });
  });
};

module.exports = insert;
