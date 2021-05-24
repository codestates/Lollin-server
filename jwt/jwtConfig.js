require('dotenv').config;

const config = {
  secretKey: process.env.Secret_Key,
  options: {
    algorithm: 'HS256',
    expiresIn: '30m',
    issuer: 'lollin_Server',
  },
};

module.exports = config;
