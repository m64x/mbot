const googleIt = require('google-it');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'google',
  aliases: ['g', 'gagle'],
  // cooldown: 5,
  execute(message, args) {
    if (!args.length) {
      message.channel.send('!g <search term>');
      return;
    }
    
    // async function foo() {
    // try {
    let embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Search results for ' + args.join(' '))
    .setAuthor('mBot', 'https://i.imgur.com/4FuW9or.png', 'https://github.com/m64x/mbot')
    .setDescription()
    .setTimestamp()
    .setFooter(`mBot ${config['version']}`, 'https://i.imgur.com/4FuW9or.png');
    
    googleIt({'query': args.join(" "), 'disableConsole': true, 'excludeSites': 'youtube.com'}).then(results => {
      console.log(results);
      results.forEach(function(item, index) { 
        console.log(item);
        embed.addField({name: item.title, value: item.link, inline: true});
        // embed.addField((index + 1) + ". " + item.title, "<" + item.link + ">");
      });
      message.channel.send(embed);
    }).catch(e => {
      console.log('[ERROR] ' + e);
      // any possible errors that might have occurred (like no Internet connection)
    });
    // } catch(e) {
    // console.log(e);
    // }
    // };
    
    // foo();
    
  }
};