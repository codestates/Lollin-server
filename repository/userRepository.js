const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
            id: userData._id,
            nickname: userData.nickname,
            type: userData.type,
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
  check: (flag, data, HttpResponse) => {
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('users');
      const wantedData = {};
      wantedData[`${flag}`] = data;
      const userData = await collection.findOne(wantedData);
      if (!userData) {
        HttpResponse.status(200).send('available username');
      } else {
        HttpResponse.status(409).send(`sorry!! ${flag} is duplicated!`);
      }
      mongoDB.close();
    });
  },
  update: (id, newNickname, newPassword, HttpResponse) => {
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('users');
      const newData = {
        $set: {
          nickname: '',
          password: '',
        },
      };
      newNickname
        ? (newData.$set.nickname = newNickname)
        : delete newData.$set.nickname;
      newPassword
        ? (newData.$set.password = bcrypt.hashSync(newPassword, 5))
        : delete newData.$set.password;
      collection.updateOne({ _id: ObjectID(id) }, newData, (err, res) => {
        if (res.result.ok === 1) {
          HttpResponse.status(200).send('successfully updated!');
        } else {
          HttpResponse.status(400).send(err);
        }
      });
    });
  },
  socialLogin: (socialUserInfo, type, HttpResponse) => {
    const { id, email } = socialUserInfo;
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('users');
      const userData = await collection.findOne({ username: `${type}_${id}` });
      if (!userData) {
        const socialUser = {
          username: `${type}_${id}`,
          password: bcrypt.hashSync(process.env.Social_Password, 5),
          email: `${email}`,
          nickname: '',
          type: `${type}`,
          createdAt: new Date(),
        };
        collection.insertOne(socialUser);
        const user = await collection.findOne({ username: `${type}_${id}` });
        const payload = {
          id: user._id,
          nickname: user.nickname,
          type: user.type,
        };
        HttpResponse.status(200).send({
          message: 'successfully logined!!',
          jwt: jwt.sign(payload, jwtConfig.secretKey, jwtConfig.options),
        });
      } else {
        const isMatched = await bcrypt.compare(
          process.env.Social_Password,
          userData.password
        );
        if (isMatched) {
          const payload = {
            id: userData._id,
            nickname: userData.nickname,
            type: userData.type,
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
  delete: (id, res) => {
    const mongoDB = new MongoClient(process.env.Mongdb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoDB.connect(async (err) => {
      const collection = mongoDB.db('lollin').collection('users');
      const result = await collection.deleteOne({ _id: ObjectID(id) });
      console.log(result);
      mongoDB.close();
      if (result.deletedCount) {
        res.status(200).send('successfully deleted');
      } else {
        res.status(404).send('user not founded');
      }
    });
  },
};

module.exports = userRepository;
