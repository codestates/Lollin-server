const router = require('express').Router();
const recent = require('../../service/recentService');
const selectAll = require('../../service/readService');
const select = require('../../service/findService');
const axios = require('axios');
const configGenerator = require('../configGenerator');
const { find } = require('cheerio/lib/api/traversing');

router.get('/all', (req, res) => {
  selectAll('champions', (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});
function isInteger(value) {
  if (parseInt(value, 10).toString() === value) {
    return true;
  }
  return false;
}
router.get('/detail', (req, res) => {
  //@@@@@@@@@@@@@@@@@
  let champId = req.query.id;
  axios
    .get('https://ddragon.leagueoflegends.com/api/versions.json')
    .then((response) => {
      return response.data[0];
    })
    .then((version) => {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `http://ddragon.leagueoflegends.com/cdn/${encodeURI(
              version
            )}/data/ko_KR/champion/${encodeURI(champId)}.json`
          )
          .then((response2) => {
            if (response2.data) {
              resolve({ champdata: response2.data, version: version });
            } else {
              reject('invalid champion id');
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    })
    .then(({ champdata, version }) => {
      let key = champdata.data[champId].key;
      switch (key.length) {
        case 1: {
          key = '000' + key;
          break;
        }
        case 2: {
          key = '00' + key;
          break;
        }
        case 3: {
          key = '0' + key;
          break;
        }
      }

      let imgs = [
        `http://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champdata.data[champId].passive.image.full}`,
      ];

      let passive = { id: champId + 'P', ...champdata.data[champId].passive };
      let skills = [passive, ...champdata.data[champId].spells];
      for (let i = 0; i < 4; i++) {
        let skillId = champdata.data[champId].spells[i];
        imgs.push(
          `http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${skillId.id}.png`
        );
      }
      let data = {
        id: champId,
        img: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_0.jpg`,
        skills: skills,
        skillsimg: imgs,
        skillwebm: [
          `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_P1.webm`,
          `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_Q1.webm`,
          `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_W1.webm`,
          `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_E1.webm`,
          `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${key}/ability_${key}_R1.webm`,
        ],
        lore: champdata.data[champId].lore,
        allytips: champdata.data[champId].allytips,
        enemytips: champdata.data[champId].enemytips,
        tags: champdata.data[champId].tags,
      };
      console.log(data);
      console.log(champId);
      console.log(version);
      res.send({ data: data });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});
router.get('/rotation', (req, res) => {
  axios(configGenerator('rotation'))
    .then((response) => {
      console.log('response.data: ');
      let intIds = response.data.freeChampionIds;
      let strIds = [];
      for (let el of intIds) {
        strIds.push(el.toString());
      }
      select('champions', { key: { $in: strIds } }, (err, result) => {
        if (err) {
          // console.log(err);
          res.status(500).send(err);
        } else {
          let finalResult = [];
          for (let el of result) {
            finalResult.push({
              id: el.id,
              img: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${el.id}_0.jpg`,
            });
          }
          console.log(finalResult);
          res.send(finalResult);
        }
      });
      // res.status(200).send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
});
router.get('/recent', (req, res) => {
  recent((err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      // console.log(result);
      let champIdArr = [];
      for (let champ of result) {
        champIdArr.push(Number(champ.key));
      }
      champIdArr.sort((a, b) => b - a);
      let recentChampId = champIdArr[0].toString();
      select('champions', { key: recentChampId }, (err, result2) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(result2[0]);
          let name = result2[0].id;
          let key = result2[0].key;
          let final = {};
          final[name] = key;
          res.send(final);
        }
      });
    }
  });
});

module.exports = router;
