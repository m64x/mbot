const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'mdn',
	description: 'get mdn links',
  args: true,
	usage: '<term>',
	execute(message, args) {

		const term = args.join(' ');
		const url = `https://developer.mozilla.org/en-US/search.json?locale=en-US&q=${term}`;

		async function foo() {
			try {
				const res = await fetch(url);
				const result = await res.json();

				// console.log(result);

				let r1 = result.documents[0]['slug'];
				let rUrl = `https://developer.mozilla.org/en-US/docs/${r1}`;
				message.channel.send(rUrl);

			} catch (e) {
				console.error(e);
				message.channel.send({ files: [process.env.KT] });
				message.reply('Nu exista termenu\' asta, boule!');
			}
		}

		foo();
	}
};