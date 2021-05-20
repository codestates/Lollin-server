const router = require('express').Router();
const userRepository = require('../../repository/userRepository');
const userService = require('../../service/userService');

//회원가입
router.post('/signup', (req, res) => {
  const user = userService.userVO(req.body);
  userRepository.signup(user);
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
