const bcrypt = require('bcrypt');

const userService = {
  userVO: (requestBody) => {
    if (
      !requestBody.username ||
      !requestBody.nickname ||
      !requestBody.email ||
      !requestBody.password
    ) {
      return null;
    }
    let user = {};
    user.username = requestBody.username;
    user.nickname = requestBody.nickname;
    user.email = requestBody.email;
    user.password = bcrypt.hashSync(requestBody.password, 5);
    return user;
  },
};

module.exports = userService;
