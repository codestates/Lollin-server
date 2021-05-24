const bcrypt = require('bcrypt');
const userRepository = require('../repository/userRepository');

const userService = {
  signup: (requestBody, res) => {
    const { username, nickname, email, password } = requestBody;
    if (!username || !nickname || !email || !password) {
      res.send(400).send('insufficient datas');
    } else {
      let user = {
        username: username,
        nickname: nickname,
        email: email,
        password: bcrypt.hashSync(password, 5),
        type: 'none',
        createdAt: new Date(),
      };
      userRepository.signup(user, res);
    }
  },
  login: (requestBody, res) => {
    const { username, password } = requestBody;
    if (!username || !password) {
      res.send(400).send('insufficient datas');
    } else {
      userRepository.login(requestBody, res);
    }
  },
  check: (reqestQuery, res) => {
    const { username, nickname } = reqestQuery;
    if (username && !nickname) {
      userRepository.check('username', username, res);
    } else if (!username && nickname) {
      userRepository.check('nickname', nickname, res);
    } else if (!username && !nickname) {
      res.status(400).send('insufficient datas');
    }
  },
};

module.exports = userService;
