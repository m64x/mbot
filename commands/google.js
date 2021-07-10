const config = require('../config.json');
const { MessageEmbed } = require('discord.js');
const googleIt = require('google-it');

module.exports = {
	name: 'google',
	description: 'search on google',
	aliases: ['g'],
	args: true,
	usage: '!p (pagination|optional) <term>',
	cooldown: 4,
	execute(message, args) {			
		if (args[0] !== '!p') {
			let embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Search results for `' + args.join(' ') + '`:')
			.setAuthor('mBot', config.avatar, config.repository)
			.setTimestamp()
			.setFooter(`mBot ${config.version}`, config.avatar);
			
			googleIt({ 'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com' }).then(results => {
				results.forEach(function (item, index) {
					embed.addField(`[${item.title}](${item.link} 'Click here to open the link')`, item.snippet);
				});
				message.channel.send(embed);
			}).catch(e => {
				console.log('[ERROR] ' + e);
			});
			
			return;
		} else {
			let pages = [];
			let page = 0;
			let x = [];
			args.shift();
			
			async function foo() {
				try {
					await googleIt({ 'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com' }).then(results => {
						results.forEach(function (item, index) {
							x[index] = {
								"title": item.title,
								"link": item.link,
								"snippet": item.snippet
							};
							// x[index] = [item.title, item.link, item.snippet];
							// x[index] = `${item.title} \n ${item.link} \n ${item.snippet}`;
						});
						
						for (i = 0; i < x.length; i++) {
							pages[i] = new MessageEmbed()
							.setColor(config.embedColor)
							.setTitle(`#${i}. ${x[i].title}`)
							.setURL(x[i].link)
							.setAuthor('mBot', config.avatar, config.repository)
							.setDescription(x[i].snippet)
							.setTimestamp()
							.setFooter(`mBot ${config.version}`, config.avatar);
						}
						
						message.channel.send(`Search results for \`${args.join(' ')}\`:`);
						
						message.channel.send(pages[0]).then(msg => {
							msg.react(config.backEmoji);
							msg.react(config.forwardEmoji).then(r => {
								const backwardsFilter = (reaction) => reaction.emoji.name === config.backEmoji;
								const forwardsFilter = (reaction) => reaction.emoji.name === config.forwardEmoji;
								const backwards = msg.createReactionCollector(backwardsFilter, { timer: 60000 });
								const forwards = msg.createReactionCollector(forwardsFilter, { timer: 60000 });
								
								backwards.on('collect', (r, u) => {
									if (page === 1) {
										return r.users.remove(r.users.cache.filter(u => u === message.author).first());
									}
									page--;
									msg.edit(pages[page]);
									r.users.remove(r.users.cache.filter(u => u === message.author).first());
								});
								
								forwards.on('collect', (r, u) => {
									if (page === pages.length) {
										return r.users.remove(r.users.cache.filter(u => u === message.author).first());
									}
									page++;
									msg.edit(pages[page]);
									r.users.remove(r.users.cache.filter(u => u === message.author).first());
								});
							});
						});
					});
				} catch(e) {
					console.log(e);
				}
			}
			foo();
		}
	}
}