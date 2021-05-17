const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('champion');
});
module.exports = router;
