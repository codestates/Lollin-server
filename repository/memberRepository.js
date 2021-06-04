const MongoClient = require('mongodb').MongoClient;
const sentimentScore = require('../naturalLanguageAPI/sentimentScore');
require('dotenv').config();

const memberRepository = {
  makeComment: (nickname, comment, HttpResponse) => {
    const options = { upsert: true };
    const query = { nickname: nickname };
    const update = { $push: { comments: comment } };
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('comments');
      collection.updateOne(query, update, options);
      if (err) {
        //HttpResponse.status(500).send('err');
      }
    });
    mongoDB.close();
    //HttpResponse.status(200).send('successfully updated!');
  },
  getScore: (nickname, HttpResponse) => {
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('score');
      const { score } = await collection.findOne({ nickname: nickname });
      let result = '';
      if (score > 0.6 && score <= 1) {
        result = 'so good';
      } else if (score > 0.2 && score <= 0.6) {
        result = 'good';
      } else if (score > -0.2 && score <= 0.2) {
        result = 'nomal';
      } else if (score > -0.6 && score <= -0.2) {
        result = 'bad';
      } else if (score > -1 && score <= -0.6) {
        result = 'very bad';
      } else {
        result = '평가 기록이 없습니다';
      }
      if (!score) {
        HttpResponse.status(200).send({
          score: '평가 기록이 없습니다.',
          result: result,
        });
      } else {
        HttpResponse.status(200).send({ score: score, result: result });
      }
      if (err) console.error(err);
    });
  },
  setScore: (nickname) => {
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const commentsCollection = mongoDB.db('lollin').collection('comments');
      const scoreCollection = mongoDB.db('lollin').collection('score');
      const { comments } = await commentsCollection.findOne({
        nickname: nickname,
      });
      let score = 0;
      // 배포전에 주석 풀어야함
      // comments.forEach((comment) => {
      //   score += sentimentScore(comment);
      // });
      const options = { upsert: true };
      const query = { nickname: nickname };
      const data = { score: score };
      const update = { $set: data };
      scoreCollection.updateOne(query, update, options);
    });
    mongoDB.close();
  },
};

module.exports = memberRepository;
