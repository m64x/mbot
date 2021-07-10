const googleIt = require('google-it');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
let paginate = false;

module.exports = {
	name: 'google',
	aliases: ['g', 'gagle'],
	cooldown: 3,
	execute(message, args) {
		if (!args.length) {
			message.channel.send('!g <search term>');
			return;
		}
		
		if (args.length >= 2) {
			if (args[0] === '!p') {
				paginate = true;
				args.shift();
			}
		}
		
		if (!paginate) {
			let embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Search results for `' + args.join(' ') + '`')
			.setAuthor('mBot', config.botAvatar, config.repository)
			.setDescription()
			.setTimestamp()
			.setFooter(`mBot ${config['version']}`, config.botAvatar);
			
			googleIt({'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com'}).then(results => {
				results.forEach(function(item, index) {
					embed.addField(item.title, item.link);
				});
				message.channel.send(embed);
			}).catch(e => {
				console.log('[ERROR] ' + e);
			});
		} else {
			let pages = [];
			let page = 0;

			googleIt({'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com'}).then(results => {
				results.forEach(function(item, index) {
					pages[index] = new MessageEmbed()
					.setColor(config.embedColor)
					.setTitle('#' + index)
					.setAuthor('mBot', config.botAvatar, config.repository)
					.addField(item.title, item.link)
					.setDescription()
					.setTimestamp()
					.setFooter(`mBot ${config['version']}`, config.botAvatar);
				});
				console.log('pages[0]: ' + pages[0]);
				// message.channel.send(embed);
			}).catch(e => {
				console.log('[ERROR] ' + e);
			});
			
			console.log(pages[0]);

			// for (i = 0; i < 10; i++) {
			// pages[i] = new MessageEmbed()
			// .setColor(config.embedColor)
			// .setTitle('Search results for `' + args.join(' ') + '`')
			// .setAuthor('mBot', config.botAvatar, config.repository)
			// .setDescription()
			// .setTimestamp()
			// .setFooter(`mBot ${config['version']}`, config.botAvatar);
			// }
			
			let m = `${pages[page]} \n Page ${page} of ${pages.length}.`;
			
			message.channel.send(pages[0]).then(msg => {
				msg.react(backArrowEmoji);
				msg.react(forwardArrowEmoji).then(r => {
					
					// Filters. off:  && user.id === message.author.id
					// const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅';
					const backwardsFilter = (reaction) => reaction.emoji.name === backArrowEmoji;
					const forwardsFilter = (reaction) => reaction.emoji.name === forwardArrowEmoji;
					const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 });
					const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 });
					
					backwards.on('collect', (r, u) => {
						if (page === 1) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
						page--
						m = `${pages[page - 1]} \n Page ${page} of ${pages.length}`;
						msg.edit(pages[page]);
						r.users.remove(r.users.cache.filter(u => u === message.author).first())
					});
					
					forwards.on('collect', (r, u) => {
						if (page === pages.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
						page++
						m = `${pages[page - 1]} \n Page ${page} of ${pages.length}.`;
						msg.edit(pages[page-1]);
						r.users.remove(r.users.cache.filter(u => u === message.author).first());
					});
				})
			});
		}
		
	}
};