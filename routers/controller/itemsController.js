const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('items');
});
module.exports = router;
