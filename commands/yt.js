const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const yt = new YouTube(process.env.YT_KEY);

const backArrowEmoji = '⬅';
const forwardArrowEmoji = '➡';

module.exports = {
	name: 'yt',
	description: 'Search videos on YouTube directly from Discord',
	args: true,
	usage: '<termen cautare>',
	execute(message, args) {
    if (!args.length) {
    	return message.reply('!yt termen cautare');
    }

    let ytlink = link => `https://youtube.com/watch?v=${link}`;

    yt.searchVideos(args.join('+'), 5).then(results => {
    	let pages = [];
    	let page = 1;

		results.forEach(result => {
			pages.push(ytlink(result.id));
    	});

      // manevra
      // const embed = new Discord.MessageEmbed() // Define a new embed
      // .setColor(0xffffff) // Set the color
      // .setFooter(`Page ${page} of ${pages.length}`)
      // .setDescription(pages[page-1]);

      let m = `${pages[page - 1]} \n Page ${page} of ${pages.length}.`;

      message.channel.send(m).then(msg => {
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
            msg.edit(m);
            r.users.remove(r.users.cache.filter(u => u === message.author).first())
          });

          forwards.on('collect', (r, u) => {
            if (page === pages.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
            page++
            m = `${pages[page - 1]} \n Page ${page} of ${pages.length}.`;
            msg.edit(m);
            r.users.remove(r.users.cache.filter(u => u === message.author).first());
          });
        })
      })
    }).catch(console.log);
  }
};
