const router = require('express').Router();
const axios = require('axios');
// const insert = require('../../service/itemsService');
router.get('/patch', (req, res) => {
  axios
    .get('http://ddragon.leagueoflegends.com/cdn/11.10.1/data/ko_KR/item.json')
    .then((response) => {
      let datas = response.data.data;
      let arr = [];
      for (let index in datas) {
        arr.push(datas[index]);
      }
      insert(arr);
      res.send(datas);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
module.exports = router;
