const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'crypto',
	aliases: ['cripto', 'c'],
	description: 'get cripto price',
	args: true,
	cooldown: 10,
	usage: '<criptomoneda> ?<moneda conversie (default = usd)> ',
	execute(message, args) {
		const apikey = process.env.CRYPTO_KEY;
		let url;
		
		if (args.length === 1) {
			url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${apikey}&symbol=${args[0]}`;
		} else if (args.length === 2) {
			url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${apikey}&symbol=${args[0]}&convert=${args[1]}`;
		}
		const messages = {
			notFound: 'Nu există această monedă.'
		};
		
		const isNumeric = (string) => {
			if (typeof string != "string") return false;
			return !isNaN(string) && !isNaN(parseFloat(string));      
		};
		
		function numberWithSeparators(number, separator) {
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
		}
		
		async function foo() {
			try {
				const result = await axios.get(url);
				const data = result.data.data[args[0].toUpperCase()];
				console.log(url);
				console.log(result);l
				datax = args[1] ? data.quote[args[1].toUpperCase()] : data.quote.USD;
				let x = datax.price;
				x = x.toFixed(9);
				x = numberWithSeparators(x, ',');
				let moneda = args[1] ? args[1].toUpperCase() : 'USD';
				let upDown24hEmoji = datax.percent_change_24h.toFixed(2) > 0 ? "⬆" : "⬇";
				let upDown7dEmoji = datax.percent_change_7d.toFixed(2) > 0 ? "⬆" : "⬇";
				let msg1 = `1 ${args[0].toUpperCase()} = ${x} ${moneda}\n
				24h: ${upDown24hEmoji} ${datax.percent_change_24h.toFixed(2)} %\n 7 zile: ${upDown7dEmoji} ${datax.percent_change_7d.toFixed(2)} %`;
				
				const embed = new MessageEmbed()
				.setColor(config.embedColor)
				.setTitle(`1 ${args[0].toUpperCase()} equals:`)
				.setAuthor(config.name, config.avatar)
				.setDescription(`${x} ${moneda}`)
				.addField('24h change', `${upDown24hEmoji} ${datax.percent_change_24h.toFixed(2)}%`, true)
				.addField('7d change', `${upDown7dEmoji} ${datax.percent_change_7d.toFixed(2)}%`, true)
				.setTimestamp()
				.setFooter(`${config.name} ${config.version}`, config.avatar);
				
				message.channel.send(embed);
			} catch (e) {
				console.log(e);
				message.channel.send(process.env.KT);
				message.reply(messages.notFound);
			}
		}
		
		foo();
	}
};