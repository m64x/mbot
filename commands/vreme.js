const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'vreme',
	description: 'vreme',
  args: true,
  usage: '<city>',
	execute(message, args) {
		if (!args.length) {
			message.reply('!vreme <oras>');
			return;
		}

		const oras = args.join(' ');
		const key = process.env['weather_key'];
		const units = 'metric';
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${oras}&units=${units}&appid=${key}`;

		async function foo() {
			try {
				const res = await fetch(url);
				const result = await res.json();


        console.log(result);
				let w = {
					weather: {
						main: result.weather[0]['main'],
						description: result.weather[0]['description'],
						icon: `http://openweathermap.org/img/w/${result.weather[0]['icon']}.png`
					},
					main: {
						temp: result.main.temp,
						feels_like: result.main.feels_like,
						temp_min: result.main.temp_min,
						temp_max: result.main.temp_max,
						pressure: result.main.pressure,
						humidity: result.main.humidity
					},
					visibility: result.visibility,
					wind: {
						speed: result.wind.speed,
						deg: result.wind.deg
					},
					clouds: {
						all: result.clouds.all
					},
					sys: {
						country: result.sys.country
					},
					name: result.name
				};

				const grade = '°C';

				const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Vremea in ' + w.name + ', ' + w.sys.country)
				.setAuthor('mBot', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
				.setDescription(`${w.main.temp} ${grade}`)
				.setThumbnail(w.weather.icon)
				.addFields(
					{ name: 'Vremea:', value: `${w.weather.description}`, inline: true},
					{ name: 'Se simte ca:', value: `${w.main.feels_like} ${grade}`, inline: true},
					{ name: 'Min:', value: `${w.main.temp_min} ${grade}`, inline: true},
					{ name: 'Max:', value: `${w.main.temp_max} ${grade}`, inline: true},
					{ name: 'Presiune atm.:', value: `${w.main.pressure}`, inline: true},
					{ name: 'Umititate:', value: `${w.main.humidity}`, inline: true},
					{ name: 'Vânt:', value: `Viteză: ${w.wind.speed}`, inline: true },
					)
				.setTimestamp()
				.setFooter('mBot ftw', 'https://i.imgur.com/wSTFkRM.png');
				message.channel.send(embed);
				console.log(result);
			} catch (e) {
				console.error(e);
				message.channel.send({files: [process.env.KT]});
				message.reply('Nu exista orasu\' asta, boule!');
			}
		}
		let vreme = foo();
	}
};