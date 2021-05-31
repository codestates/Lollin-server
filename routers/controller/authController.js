const router = require('express').Router();
const axios = require('axios');
const userService = require('../../service/userService');

require('dotenv').config();

router.get('/naver', (req, response) => {
  const type = 'naver';
  const { code, state } = req.query;
  const api_uri = `https://nid.naver.com/oauth2.0/token?client_id=${process.env.Naver_Client_Id}&client_secret=${process.env.Naver_Client_Secret}&grant_type=authorization_code&state=${state}&code=${code}`;
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
        client_id: `${process.env.Kakao_Client_Id}`,
        redirect_uri: `${process.env.Kakao_Redirection_Uri}`,
        code: code,
        client_secret: `${process.env.Kakao_Client_Secret}`,
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
