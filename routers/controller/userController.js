const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

//회원가입
router.post('/signup', (req, res) => {
  let user = {
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    email: req.body.email,
  };

  const mongoDB = new MongoClient(process.env.Mongdb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoDB.connect((err) => {
    const collection = mongoDB.db('lollin').collection('users');
    collection.insertOne(user, (err, res) => {
      if (err) throw err;
      console.log(user);
      mongoDB.close();
    });
  });

  res.send('user');
});

//로그인
router.post('/login', (req, res) => {
  console.log(req.body);

  res.send('user');
});

//로그아웃
router.post('/logout', (req, res) => {
  console.log(req.body);

  res.send('user');
});

//유저 아이디, 닉네임 중복조회
router.get('/check', (req, res) => {
  console.log(req.body);

  res.send('user');
});

//유저 정보 변경
router.post('/update', (req, res) => {
  console.log(req.body);

  res.send('user');
});
module.exports = router;
