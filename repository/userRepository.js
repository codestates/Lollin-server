const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const userRepository = {
  signup: async (user) => {
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoDB.connect((err) => {
      const collection = mongoDB.db('lollin').collection('users');
      collection.insertOne(user, (err, res) => {
        if (err) throw err;
        mongoDB.close();
      });
    });
  },
};

module.exports = userRepository;
