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


router.post('/kakao', (req, response) => {
  const type = 'kakao';
  const userData = {
    id: req.body.id,
    email: req.body.email,
  };
  console.log(userData);
  userService.socialLogin(userData, type, response);

});

module.exports = router;
