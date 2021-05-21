require('dotenv').config();

const configGenerator = function (apiType, param) {
	switch (apiType) {
		case 'activegame': {
			console.log('param: ', param);
			console.log('encode url');
			console.log(encodeURI(param));
			return {
				method: 'get',
				url: `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encodeURI(
					param,
				)}`,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': process.env.Riot_Token,
				},
			};
		}
		case 'userinfo': {
			console.log('param: ', param);
			console.log('encode url');
			console.log(encodeURI(param));
			return {
				method: 'get',
				url: `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(
					param,
				)}`,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': process.env.Riot_Token,
				},
			};
		}
		case 'rotation': {
			return {
				method: 'get',
				url: `https://kr.api.riotgames.com/lol/platform/v3/champion-rotations`,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': process.env.Riot_Token,
				},
			};
		}
		default: {
			break;
		}
	}
};

module.exports = configGenerator;
