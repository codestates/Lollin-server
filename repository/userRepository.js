const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwtConfig = require('../jwt/jwtConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userRepository = {
  signup: async (user, HttpResponse) => {
    const { username } = user;
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('users');
      const isduplicated = await collection.findOne({ username: username });
      if (isduplicated) {
        HttpResponse.status(409).send('duplicated username');
        mongoDB.close();
      } else {
        collection.insertOne(user, (err, res) => {
          if (err) throw err;
          HttpResponse.status(200).send('successfully sign up');
          mongoDB.close();
        });
      }
    });
  },
  login: (requestBody, HttpResponse) => {
    const { username, password } = requestBody;
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('users');
      const userData = await collection.findOne({ username: username });
      if (!userData) {
        HttpResponse.status(401).send('user not found or wrong password');
      } else {
        const isMatched = await bcrypt.compare(password, userData.password);
        if (isMatched) {
          const payload = {
            username: userData.username,
            nickname: userData.nickname,
          };

          HttpResponse.status(200).send({
            message: 'successfully logined!!',
            jwt: jwt.sign(payload, jwtConfig.secretKey, jwtConfig.options),
          });
        } else {
          HttpResponse.status(401).send('user not found or wrong password');
        }
      }
      mongoDB.close();
    });
  },
};

module.exports = userRepository;
