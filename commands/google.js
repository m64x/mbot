const googleIt = require('google-it');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'google',
  aliases: ['g', 'gagle'],
  cooldown: 3,
  execute(message, args) {
    if (!args.length) {
      message.channel.send('!g <search term>');
      return;
    }

    let embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Search results for `' + args.join(' ') + '`')
    .setAuthor('mBot', config.botAvatar, 'https://github.com/m64x/mbot')
    .setDescription()
    .setTimestamp()
    .setFooter(`mBot ${config['version']}`, config.botAvatar);
    
    googleIt({'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com'}).then(results => {
      console.log(results);
      results.forEach(function(item, index) { 
        console.log(item);
        embed.addField(item.title, item.link);
        // embed.addField((index + 1) + ". " + item.title, "<" + item.link + ">");
      });
      message.channel.send(embed);
    }).catch(e => {
      console.log('[ERROR] ' + e);
      // any possible errors that might have occurred (like no Internet connection)
    });
    
  }
};