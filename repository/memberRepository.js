const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const memberRepository = {
  makeComment: (data) => {
    const options = { upsert: true };
    const query = { nickname: data.nickname };
    const update = { $push: { comments: data.comment } };
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('comments');
      collection.updateOne(query, update, options);
    });
    return mongoDB;
  },
};

module.exports = memberRepository;
