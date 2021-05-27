const router = require('express').Router();
const memberService = require('../../service/memberService');
//mongo db
router.post('/comment', (req, res) => {
  memberService.makeComment(req, res);
});
module.exports = router;
