require('dotenv').config();
const app = require('express')();
const router = require('./routers/router');
const axios = require('axios');
const express = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const patch = require('./patch/patchController');
const configGenerator = require('./routers/configGenerator');
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/user', router.userController);
app.use('/champions', router.championsController);
app.use('/items', router.itemsController);
app.use('/utils', router.utilsController);
app.use('/members', router.membersController);
app.use('/recommend', router.recommendController);
app.use('/auth', router.authContorller);

let currentVersion = fs.readFileSync('./dataVersion.txt').toString();

setInterval(() => {
	patch(currentVersion, (version) => {
		currentVersion = version;
		fs.writeFileSync('./dataVersion.txt', version);
		console.log('patch occured, Current version: ' + currentVersion);
		setRunesJson(currentVersion);
	});
}, 3600000);
//3600000
function setRunesJson(version) {
	axios
		.get(
			`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/runesReforged.json`,
		)
		.then((resAllrunes) => {
			let runes = resAllrunes.data;
			const setNewRunes = (newRunes = []) => {
				for (let keyStone of runes) {
					let newKeyStone = {
						id: keyStone.id,
						key: keyStone.key,
						icon: keyStone.icon,
						name: keyStone.iCon,
					};
					newRunes.push(newKeyStone);
					for (let slot of keyStone.slots) {
						for (let rune of slot.runes) {
							newRunes.push(rune);
						}
					}
				}
				// {
				// 	"id": 5002,
				// 	"name": "Armor",
				// 	"majorChangePatchVersion": "",
				// 	"tooltip": "+6 Armor",
				// 	"shortDesc": "+6 Armor",
				// 	"longDesc": "+6 Armor",
				// 	"iconPath": "/lol-game-data/assets/v1/perk-images/StatMods/StatModsArmorIcon.png",
				// 	"endOfGameStatDescs": [

				// 	]
				//   },
				// {
				// 	"id": 5008,
				// 	"name": "Adaptive",
				// 	"majorChangePatchVersion": "",
				// 	"tooltip": "<scaleAD>+@f2@ Attack Damage</scaleAD>",
				// 	"shortDesc": "+9 <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_Adaptive'><font color='#48C4B7'>Adaptive Force</font></lol-uikit-tooltipped-keyword>",
				// 	"longDesc": "+9 <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_Adaptive'><font color='#48C4B7'>Adaptive Force</font></lol-uikit-tooltipped-keyword>",
				// 	"iconPath": "/lol-game-data/assets/v1/perk-images/StatMods/StatModsAdaptiveForceIcon.png",
				// 	"endOfGameStatDescs": [

				// 	]
				//   },
				// {
				// 	"id": 5001,
				// 	"name": "HealthScaling",
				// 	"majorChangePatchVersion": "",
				// 	"tooltip": "+@f1@ Health (based on level)",
				// 	"shortDesc": "+15-90 Health (based on level)",
				// 	"longDesc": "+15-90 Health (based on level)",
				// 	"iconPath": "/lol-game-data/assets/v1/perk-images/StatMods/StatModsHealthScalingIcon.png",
				// 	"endOfGameStatDescs": [

				// 	]
				//   },
				// {
				// 	"id": 5007,
				// 	"name": "CDRScaling",
				// 	"majorChangePatchVersion": "",
				// 	"tooltip": "+@f1@ Ability Haste",
				// 	"shortDesc": "+8 <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_CDR'>Ability Haste</lol-uikit-tooltipped-keyword> ",
				// 	"longDesc": "+8 <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_CDR'>Ability Haste</lol-uikit-tooltipped-keyword> ",
				// 	"iconPath": "/lol-game-data/assets/v1/perk-images/StatMods/StatModsCDRScalingIcon.png",
				// 	"endOfGameStatDescs": [

				// 	]
				//   },
				//   {
				// 	"id": 5005,
				// 	"name": "AttackSpeed",
				// 	"majorChangePatchVersion": "",
				// 	"tooltip": "+10% Attack Speed",
				// 	"shortDesc": "+10% Attack Speed",
				// 	"longDesc": "+10% Attack Speed",
				// 	"iconPath": "/lol-game-data/assets/v1/perk-images/StatMods/StatModsAttackSpeedIcon.png",
				// 	"endOfGameStatDescs": [

				// 	]
				//   },
				//   {
				// 	"id": 5003,
				// 	"name": "MagicRes",
				// 	"majorChangePatchVersion": "",
				// 	"tooltip": "+8 Magic Resist",
				// 	"shortDesc": "+8 Magic Resist",
				// 	"longDesc": "+8 Magic Resist",
				// 	"iconPath": "/lol-game-data/assets/v1/perk-images/StatMods/StatModsMagicResIcon.png",
				// 	"endOfGameStatDescs": [

				// 	]
				//   },
				// {
				// 	"id": 9923,
				// 	"key": "HailOfBlades",
				// 	"icon": "perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png",
				// 	"name": "칼날비",
				// 	"shortDesc": "적 챔피언에 대한 첫 공격 3회 동안 공격 속도 대폭 증가",
				// 	"longDesc": "적 챔피언에 대한 3번째 공격까지 공격 속도가 110% 증가합니다.<br><br>3초 안에 다음 공격을 가하지 못하면 효과가 사라집니다.<br><br>재사용 대기시간: 12초<br><br><rules>기본 공격 모션이 취소될 경우 공격 속도 증가 효과가 적용되는 공격 횟수가 1회 늘어납니다.<br>일시적으로 최고 공격 속도 제한을 초과할 수 있습니다.</rules>"
				//   }
				let makeStats = (id, key, icon, name, shortDesc, longDesc) => {
					return {
						id: id,
						key: key,
						icon: icon,
						name: name,
						shortDesc: shortDesc,
						longDesc: longDesc,
					};
				};
				newRunes.push(
					makeStats(
						5001,
						'HealthScaling',
						'perk-images/StatMods/StatModsHealthScalingIcon.png',
						'체력',
						'체력 증가',
						'체력 + 15~90(레벨에 비례)',
					),
				);
				newRunes.push(
					makeStats(
						5002,
						'Armor',
						'perk-images/StatMods/StatModsArmorIcon.png',
						'방어',
						'방어력 증가',
						'방어력 +6',
					),
				);
				newRunes.push(
					makeStats(
						5003,
						'MagicRes',
						'perk-images/StatMods/StatModsMagicResIcon.png',
						'방어',
						'마법 저항력 증가',
						'마법 저항력 + 8',
					),
				);
				newRunes.push(
					makeStats(
						5005,
						'AttackSpeed',
						'perk-images/StatMods/StatModsAttackSpeedIcon.png',
						'공격 속도',
						'공격 속도 증가',
						'공격 속도 + 10%',
					),
				);
				newRunes.push(
					makeStats(
						5007,
						'CDRScaling',
						'perk-images/StatMods/StatModsCDRScalingIcon.png',
						'스킬 가속',
						'스킬 가속 증가',
						'스킬 가속 + 8',
					),
				);
				newRunes.push(
					makeStats(
						5008,
						'Adaptive',
						'perk-images/StatMods/StatModsAdaptiveForceIcon.png',
						'공격',
						'적응형 능력치 증가',
						'적응형 능력치 +9',
					),
				);
				return newRunes;
			};
			fs.writeFileSync('./runes.json', JSON.stringify(setNewRunes()));
		});
}

app.get('/', (req, res) => {
	let buffer = fs.readFileSync('./dataVersion.txt');
	let token = fs.readFileSync('./riotAPI.txt');
	res.send({ currentVersion: buffer.toString(), riotToken: token.toString() });
});
app.get('/setToken', (req, res) => {
	let newToken = req.query.token;
	fs.writeFileSync('./riotAPI.txt', newToken);
	let buffer = fs.readFileSync('./riotAPI.txt');
	configGenerator('tokenSet', newToken);
	res.send('token changed. new Token: ' + buffer.toString());
});
app.get('/riot.txt', (req, res) => {
	let buffer = fs.readFileSync('./riot.txt');
	res.send(buffer.toString());
});
app.get('/rune', (req, res) => {
	let rawData = fs.readFileSync('./runes.json').toString();
	let jsons = JSON.parse(rawData);
	if (req.query.id) {
		let id = Number(req.query.id);
		console.log(id);
		for (let json of jsons) {
			if (json.id === id) {
				json.icon = `https://ddragon.leagueoflegends.com/cdn/img/${json.icon}`;
				res.json(json);
				return;
			}
		}
		res.send('no such rune');
	} else {
		res.json(jsons);
	}
});

app.listen(process.env.PORT, () => {
	console.log(`server is listening ${process.env.PORT}`);
	configGenerator('tokenSet', fs.readFileSync('./riotAPI.txt').toString());
	setRunesJson(currentVersion);
});
