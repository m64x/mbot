let fs = require('fs');
let config = JSON.parse(fs.readFileSync("./config.json"));
const { MessageEmbed } = require('discord.js');
let fetch = require('node-fetch');

let Parser = require('rss-parser');
let parser = new Parser();

module.exports = {
    name: 'rss',
    aliases: ['feed'],
    description: 'fetch a rss feed',
    execute(message, args) {
        if (!args.length) {
            message.channel.send('Syntax: !rss <feed url>');
            return;
        }

        const RSS_URL = args[0];

        (async () => {

            let feed = await parser.parseURL(RSS_URL);

            console.log(feed);

            let embed = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle(`[**${feed.title}**](${feed.link}) - RSS Feed`)
            .setDescription(feed.description)
            .setAuthor(config.name, config.avatar)
            .setTimestamp()
            .setFooter(`${config.name} ${config.version}`, config.avatar);

            console.log(feed.items.length);

            for (let i = 0; i < 5; i++) {
                const e = feed.items[i];

                embed.addField(`${i+1}`, `[${e.title}](${e.link})`);
            }

            // feed.items.forEach(item => {});

            message.channel.send(embed);
          
          })();

    }
};