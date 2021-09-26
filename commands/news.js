const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'news',
	aliases: ['n'],
	description: 'news from nytimes',
	execute(message) {
		
		const apikey = process.env.nytimes;
		const url = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${apikey}`;
		
		async function foo() {
			try {
				const res = await fetch(url);
				const result = await res.json();
				
				let pages = [];
				
				for (i = 0; i < 10; i++) {
					let title = result.results[i].title;
					pages[i] = new MessageEmbed()
					.setColor(config.embedColor)
					.setTitle(`Top world news from NY Times. **[${i + 1}/10]**`)
					.setImage(result.results[i].multimedia[0].url)
					.setAuthor(config.name, config.avatar)
					.setDescription(`[**${result.results[i].title}**](${result.results[i].short_url}) \n ${result.results[i].abstract}`)
					.addField('Author', result.results[i].byline, true)
					.addField('Posted on', result.results[i].published_date, true)	
					.setTimestamp()
					.setFooter(`${config.name} ${config.version}`, config.avatar);
				}
				
				let page = 0;
				
				message.channel.send(pages[0]).then(msg => {
					msg.react(config.backEmoji);
					msg.react(config.forwardEmoji).then(r => {
						// Filters. off:  && user.id === message.author.id
						// const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅';
						const backwardsFilter = (reaction) => reaction.emoji.name === config.backEmoji;
						const forwardsFilter = (reaction) => reaction.emoji.name === config.forwardEmoji;
						const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 });
						const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 });
						
						backwards.on('collect', (r, u) => {
							if (page === 1) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
							page--
							msg.edit(pages[page]);
							r.users.remove(r.users.cache.filter(u => u === message.author).first())
						});
						
						forwards.on('collect', (r, u) => {
							if (page === pages.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
							page++
							msg.edit(pages[page]);
							r.users.remove(r.users.cache.filter(u => u === message.author).first());
						});
					})
				});
				
				// const embed = new MessageEmbed()
				// .setColor(config.embedColor)
				// .setTitle(`Top world news from NY Times. [1/5]`)
				// .setAuthor(config.name, config.avatar)
				// .setImage(result.results[0].multimedia[0].url)
				// .setDescription(`[**${result.results[0].title}**](${result.results[0].short_url}) \n ${result.results[0].abstract}`)
				// .addField('Author', result.results[0].byline, true)
				// .addField('Posted on', result.results[0].published_date, true)
				// .setTimestamp()
				// .setFooter(`${config.name} ${config.version}`, config.avatar);			
				
				// message.channel.send(embed);			
				
				
			} catch(e) {
				console.log(e);
				message.channel.send({files: [process.env.KT]});
			}
		}
		
		foo();
		
	}
};

