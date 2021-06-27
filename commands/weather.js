const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

// const fs = require('fs');
// const config = JSON.parse(fs.readFileSync("../config.json"));
const config = require('../config.json');
const f = require('../functions');

module.exports = {
	name: 'weather',
	description: 'weather',
	aliases: ['w'],
	args: true,
	usage: '<city>',
	execute(message, args) {
		if (!args.length) {
			message.reply('!weather <city>');
			return;
		}
		
		const city = args.join(' ');
		const key = process.env['weather_key'];
		const units = 'metric';
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${key}`;
		
		async function foo() {
			try {
				const fetchWeather = await fetch(url);
				const result = await fetchWeather.json();

				f.debug(result);

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
						country: result.sys.country,
						sunrise: result.sys.sunrise,
						sunset: result.sys.sunset
					},
					timezoneOffset: result.timezone,
					name: result.name
				};
				
				function weatherFormat(value) {
					return value.toFixed(1) + ' °C';
				}
				
				let sunrise = new Date(w.sys.sunrise * 1000 + (w.timezoneOffset * 1000));
				let sunset = new Date(w.sys.sunset * 1000 + (w.timezoneOffset * 1000));

				const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Weather in ' + w.name + ', ' + w.sys.country)
				.setAuthor('mBot', 'https://i.imgur.com/4FuW9or.png', 'https://github.com/m64x/mbot')
				.setDescription(`${weatherFormat(w.main.temp)}`)
				.setThumbnail(w.weather.icon)
				.addFields(
					{ name: 'Weather', value: `${w.weather.description}`, inline: true},
					{ name: 'Feels like', value: `${weatherFormat(w.main.feels_like)} `, inline: true},
					{ name: 'Min', value: `${weatherFormat(w.main.temp_min)} `, inline: true},
					{ name: 'Max', value: `${weatherFormat(w.main.temp_max)} `, inline: true},
					{ name: 'Atm. pressure', value: `${w.main.pressure}`, inline: true},
					{ name: 'Humidity', value: `${w.main.humidity}`, inline: true},
					{ name: 'Wind', value: `${w.wind.speed} km/h`, inline: true },
					{name: 'Sunrise', value: sunrise.getHours() + ':' + sunrise.getMinutes(), inline: true},
					{name: 'Sunset', value: sunset.getHours() + ':' + sunset.getMinutes(), inline: true}
					)
					.setTimestamp()
					.setFooter(`mBot ${config['version']}`, 'https://i.imgur.com/4FuW9or.png');
					message.channel.send(embed);
					console.log(result);
				} catch (e) {
					console.error(e);
					message.channel.send({files: [process.env.KT]});
					message.reply('This city does not exist!');
				}
			}
			let vreme = foo();
		}
	};