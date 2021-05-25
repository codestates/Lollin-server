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
  axios
    .get(api_uri)
    .then((res) => {
      const { access_token, token_type } = res.data;
      axios
        .get('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        })
        .then((res) => {
          userService.socialLogin(res.data.response, type, response);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get('/kakao', (req, response) => {
  const { code } = req.query;
  axios
    .post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: 'cd4677d8a6e0305aea9a7e69cc3ee183',
        redirect_uri: 'http://localhost:4000/auth/kakao',
        code: code,
        client_secret: '6du4IJBbs04MuFoKnFdyfjQHSQdJNpz5',
      },
    })
    .then((res) => {
      const { access_token } = res.data;
      axios
        .post('https://kapi.kakao.com/v2/user/me', null, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((res) => {
          const type = 'kakao';
          const userData = {
            id: res.data.id,
            email: res.data.kakao_account.email,
          };
          userService.socialLogin(userData, type, response);
        })
        .catch((err) => console.log(err));
      // 카카오톡 로그아웃
      axios.post('https://kapi.kakao.com/v1/user/logout', null, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
