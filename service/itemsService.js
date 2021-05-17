const mongoDB = require('../repository/connectionMongoDB');

mongoDB.connect((err) => {
  const collection = mongoDB.db('lollin').collection('items');
  // perform actions on the collection object
  collection.insertOne(test, (err, res) => {
    if (err) throw err;

    console.log('1 document inserted');
    mongoDB.close();
  });
});
