const router = require('express').Router();
const axios = require('axios');
const userService = require('../../service/userService');
require('dotenv').config();

const client_id = '8lA0wX_a_7Ol1i2LsNH7';
const client_secret = '5A1hi4u700';

router.get('/naver', (req, response) => {
  const type = 'naver';
  const { code, state } = req.query;
  const api_uri = `https://nid.naver.com/oauth2.0/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=authorization_code&state=${state}&code=${code}`;
  axios.get(api_uri).then((res) => {
    const { access_token, token_type } = res.data;
    axios
      .get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      })
      .then((res) => {
        userService.socialLogin(res.data.response, type, response);
      });
  });
});

router.get('/kakao', (req, res) => {});

router.get('/google', (req, res) => {});

module.exports = router;
