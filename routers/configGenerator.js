const fs = require('fs');
let token = '';
const configGenerator = function (apiType, param) {
	switch (apiType) {
		case 'tokenSet': {
			token = param;
		}
		case 'activegame': {
			// console.log('param: ', param);
			// console.log('encode url');
			// console.log(encodeURI(param));
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
					'X-Riot-Token': token,
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
					'X-Riot-Token': token,
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
					'X-Riot-Token': token,
				},
			};
		}
		case 'featured': {
			return {
				method: 'get',
				url: `https://kr.api.riotgames.com/lol/spectator/v4/featured-games`,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': token,
				},
			};
		}
		case 'league': {
			return {
				method: 'get',
				url: `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${param}`,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': token,
				},
			};
		}
		case 'matchList': {
			console.log('inside match list');
			console.log('param: ', param);
			return {
				method: 'get',
				url: `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${param}/ids?start=0&count=20`,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': token,
				},
			};
		}
		case 'match': {
			return {
				method: 'get',
				url: `https://asia.api.riotgames.com/lol/match/v5/matches/${param}`,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': token,
				},
			};
		}
		default: {
			break;
		}
	}
};

module.exports = configGenerator;
