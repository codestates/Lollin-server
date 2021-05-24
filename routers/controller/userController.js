const router = require('express').Router();
const userService = require('../../service/userService');
require('dotenv').config();

//회원가입
router.post('/signup', (req, res) => {
  userService.signup(req.body, res);
});

//로그인
router.post('/login', (req, res) => {
  userService.login(req.body, res);
});

//유저 아이디, 닉네임 중복조회
router.get('/check', (req, res) => {
  userService.check(req.query, res);
});

//유저 정보 변경
router.post('/update', (req, res) => {
  console.log(req.body);

  res.send('user');
});
module.exports = router;
