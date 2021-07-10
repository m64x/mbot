import googleIt from 'google-it';
import { MessageEmbed } from 'discord.js';
import config, { botAvatar, repository, embedColor } from '../config.json';
let paginate = false;

export const name = 'google';
export const aliases = ['g', 'gagle'];
export const cooldown = 3;
export function execute(message, args) {
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
		.setAuthor('mBot', botAvatar, repository)
		.setDescription()
		.setTimestamp()
		.setFooter(`mBot ${config['version']}`, botAvatar);
		
		googleIt({ 'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com' }).then(results => {
			results.forEach(function (item, index) {
				embed.addField(item.title, item.link);
			});
			message.channel.send(embed);
		}).catch(e => {
			console.log('[ERROR] ' + e);
		});
	} else {
		let pages = [];
		let page = 0;
		let x = [];
		
		try {
			googleIt({ 'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com' }).then(results => {
				results.forEach(function (item, index) {
					x[index] = item.title + " | " + item.link;
					console.log('obj: ' + x[index]);
				}).catch(e => {
					console.log('[ERROR] ' + e);
				});
				
				for (i = 0; i < 10; i++) {
					pages[i] = new MessageEmbed()
					.setColor(embedColor)
					.setTitle(`# ${index}`)
					.setAuthor('mBot', botAvatar, repository)
					.setDescription(x[i])
					.setTimestamp()
					.setFooter(`mBot ${config['version']}`, botAvatar);
				}
				
				let m = `${pages[page]} \n Page ${page} of ${pages.length}.`;
				
				message.channel.send(pages[0]).then(msg => {
					msg.react(backArrowEmoji);
					msg.react(forwardArrowEmoji).then(r => {
						
						const backwardsFilter = (reaction) => reaction.emoji.name === backArrowEmoji;
						const forwardsFilter = (reaction) => reaction.emoji.name === forwardArrowEmoji;
						const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 });
						const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 });
						
						backwards.on('collect', (r, u) => {
							if (page === 1)
							return r.users.remove(r.users.cache.filter(u => u === message.author).first());
							page--;
							m = `${pages[page - 1]} \n Page ${page} of ${pages.length}`;
							msg.edit(pages[page]);
							r.users.remove(r.users.cache.filter(u => u === message.author).first());
						});
						
						forwards.on('collect', (r, u) => {
							if (page === pages.length)
							return r.users.remove(r.users.cache.filter(u => u === message.author).first());
							page++;
							m = `${pages[page - 1]} \n Page ${page} of ${pages.length}.`;
							msg.edit(pages[page - 1]);
							r.users.remove(r.users.cache.filter(u => u === message.author).first());
						});
					});
				});
			});
		} catch(e) {
			console.log(e);
		}
		// else(pagination)
	}
}