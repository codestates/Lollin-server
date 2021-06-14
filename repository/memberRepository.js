const MongoClient = require('mongodb').MongoClient;
const sentimentScore = require('../naturalLanguageAPI/sentimentScore');
require('dotenv').config();

const memberRepository = {
  makeComment: (nickname, comment, HttpResponse) => {
	console.log(nickname,comment);   
 const options = { upsert: true };
    const query = { nickname: nickname };
    const update = { $push: { comments: comment } };
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('comments');
      const collection2 = mongoDB.db('lollin').collection('score');
     const result = await sentimentScore(comment);
      const score = result[0].documentSentiment.score; 
 collection.updateOne(query, update, options);
 collection2.updateOne(query, { $push: { score: score } }, options);
      if (err) {
      HttpResponse.status(500).send('err');
      }
    });
    mongoDB.close();
  HttpResponse.status(200).send('successfully updated!');
  },
  getScore: (nickname, HttpResponse) => {   
 const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('score');    
      const data = { nickname: nickname };
      const sco = await collection.findOne(data);
      let score = 0;
      if (!sco) {
        score = null;
      } else {
        sco.score.forEach((point) => {
          score += point;
        });
        score = Number((score / sco.score.length).toFixed(2));
      }
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
      if (score===null) {
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
};

module.exports = memberRepository;
