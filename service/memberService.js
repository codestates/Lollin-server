const memberRepository = require('../repository/memberRepository');

const memberService = {
  makeComment: (req, res) => {
    const { members } = req.body;
    let datas = [];
    if (members) {
      for (let i = 0; i < members.length; i++) {
        if (members[i].comment) {
          const data = {
            nickname: members[i].summonerName,
            comment: members[i].comment,
          };
          datas.push(data);
        }
      }
    }
    let mongodb;
    datas.forEach((data) => {
      mongodb = memberRepository.makeComment(data);
    });
    mongodb.close();
    res.status(200).send('comments updated!');
  },
};
module.exports = memberService;
