const router = require('express').Router();
const axios = require('axios');
router.get('/', (req, res) => {
  selectAll('champions', (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});
module.exports = router;
