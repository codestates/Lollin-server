const router = require('express').Router();
const selectAll = require('../../service/itemsService');
router.get('/', (req, res) => {
  selectAll('items', (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});
module.exports = router;
