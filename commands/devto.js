const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'devto',
  description: 'Get dev.to articles',
  usage: '<tag>',
  execute(message, args) {
    let baseUrl = 'https://dev.to/api/articles';
    let parameters;

    function isNumeric(str) {
      if (typeof str != "string") return false;
      return !isNaN(str) && !isNaN(parseFloat(str));
    }

    if (!args.length) {
      parameters = '?top=14&per_page=10';
    } else if (args.length === 1) {
      parameters = `?top=14&per_page=10&tag=${args[0]}`;
    } else if (args.length === 2) {
      if (isNumeric(args[1])) {
        if (parseInt(args[1]) < 3 || parseInt(args[1]) > 25) {
          message.reply('se pot afisa intre 3-25 linkuri.');
          return;
        }
        parameters = `?top=14&tag=${args[0]}&per_page=${parseInt(args[1])}`;
      } else if (args[1] === 'new') {
        parameters = `?per_page=10&tag=${args[0]}&state=fresh`;
      }
    }

    const url = baseUrl + parameters;

    async function getStuff() {
      try {
        const res = await fetch(url);
        const result = await res.json();

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Dev.to')
          .setAuthor('mBot')
          .setThumbnail('https://i.imgur.com/kMQNt61.png')
          .setTimestamp()
          .setFooter('mBot ftw');

        if (args[0]) {
          embed.setDescription('Best `' + args[0] + '` articles from last 14 days.')
        } else {
          embed.setDescription('Best articles from last 14 days.')
        }
// \u200B
        result.forEach(r => {
          embed.addField(`${r['readable_publish_date']}`, `[${r['title']}](${r['url']})`, true);
          embed.addField(`${r['description']}`, '\u200B');
        });

        message.channel.send(embed);
        console.log(result);
      } catch (e) {
        console.error(e);
        message.channel.send(process.env.KT);
        // message.reply('Nu exista orasu\' asta, boule!');
      }
    }
    getStuff();

  }
};