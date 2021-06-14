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
patch(currentVersion, (version) => {
	currentVersion = version;
	fs.writeFileSync('./dataVersion.txt', version);
	console.log('patch occured, Current version: ' + currentVersion);
	setRunesJson(currentVersion);
});

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
			`http://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/runesReforged.json`,
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
