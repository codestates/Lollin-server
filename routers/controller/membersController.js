const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('members');
});
module.exports = router;
