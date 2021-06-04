const router = require('express').Router();
const memberService = require('../../service/memberService');
const decode = require('../../jwt/jwtDecode');
//mongo db
router.post('/comment', (req, res) => {
  const userData = await decode(req.body.jwt);
  if (userData === -2) {
    res.send(400).send('invalid token');
  } else if (userData === -3) {
    res.send(400).send('expired token');
  } else {
    memberService.makeComment(req, res);
  }
});

router.get('/score',(req,res)=>{
  const {nickname} = req.query
  memberService.getScroe(nickname,res)
})
module.exports = router;
