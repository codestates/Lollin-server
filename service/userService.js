const bcrypt = require('bcrypt');

const userService = {
  userVO: (requestBody) => {
    let user = {};
    user.username = requestBody.username;
    user.nickname = requestBody.nickname;
    user.email = requestBody.email;
    user.password = bcrypt.hashSync(requestBody.password, 5);
    return user;
  },
};

module.exports = userService;
