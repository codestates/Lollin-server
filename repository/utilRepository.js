const MongoClient = require('mongodb').MongoClient;
const sentimentScore = require('../naturalLanguageAPI/sentimentScore');

const scoreResult = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'];

const utilRepository = {
  getScore: (nickname, matchResult, HttpResponse) => {
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('comments');
      let scoreSum = 0;
      const { comments } = await collection.findOne({ nickname: nickname });
      for (let i = 0; i < comments.length; i++) {
        scoreSum += await sentimentScore(comments[i]);
      }
      mongoDB.close();
      let score = parseFloat(scoreSum / comments.length).toFixed(2);
      console.log(score);
      if (0.6 <= score && score <= 1) {
        score = scoreResult[4];
      } else if (0.2 <= score && score < 0.6) {
        score = scoreResult[3];
      } else if (-0.2 <= score && score < 0.2) {
        score = scoreResult[2];
      } else if (-0.6 <= score && score < -0.2) {
        score = scoreResult[1];
      } else if (-1 <= score && score < -0.6) {
        score = scoreResult[0];
      } else {
        score = '평가 결과가 없습니다';
      }
      matchResult.data.score = score;
      HttpResponse.status(200).send(matchResult.data);
    });
  },
};

module.exports = utilRepository;
