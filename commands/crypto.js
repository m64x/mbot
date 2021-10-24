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
		

		function toFixxed(x) {
			if (Math.abs(x) < 1.0) {
			  var e = parseInt(x.toString().split('e-')[1]);
			  if (e) {
				  x *= Math.pow(10,e-1);
				  x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
			  }
			} else {
			  var e = parseInt(x.toString().split('+')[1]);
			  if (e > 20) {
				  e -= 20;
				  x /= Math.pow(10,e);
				  x += (new Array(e+1)).join('0');
			  }
			}
			return x;
		  }
		  

		async function foo() {
			try {
				const result = await axios.get(url);
				const data = result.data.data[args[0].toUpperCase()];
				datax = args[1] ? data.quote[args[1].toUpperCase()] : data.quote.USD;
				let x = datax.price;

				if (x >= 0.01) {
					x = x.toFixed(2);
					x = Number(x).toLocaleString('en');
				} else {
					x = toFixxed(x);
				}

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