const memberRepository = require('../repository/memberRepository');

const memberService = {
  makeComment: (req, res) => {
    const { nickname, comment } = req.body.data;
    // const { nickname, comment } = req;
    memberRepository.makeComment(nickname, comment, res);
    memberRepository.setScore(nickname);
  },
  getScore: (nickname, res) => {
    memberRepository.getScore(nickname, res);
  },
};
module.exports = memberService;
