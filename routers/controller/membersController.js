const router = require('express').Router();
//mongo db
router.get('/', (req, res) => {
  res.send('members');
});
module.exports = router;
