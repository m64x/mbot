let fs = require('fs');
let config = JSON.parse(fs.readFileSync("./config.json"));
const { MessageEmbed } = require('discord.js');
let fetch = require('node-fetch');

let Parser = require('rss-parser');
let parser = new Parser();

module.exports = {
    name: 'biziday',
    aliases: ['b'],
    description: 'stirile biziday',
    execute(message, args) {
        let paginate = false;
        const RSS_URL = 'https://biziday.ro/feed';
        
        if (args.length && args[0] === 't') {
            
            (async () => {
                let feed = await parser.parseURL(RSS_URL);            
                
                let embed = new MessageEmbed()
                .setColor(config.embedColor)
                .setTitle(feed.title)
                .setThumbnail(feed.image.url)
                .setAuthor(config.name, config.avatar)
                .setDescription(`${feed.description}`)
                .setTimestamp()
                .setFooter(`${config.name} ${config.version}`, config.avatar);
                
                for (let i = 0; i < 8; i++) {
                    embed.addField(`#${i+1}`, `[${feed.items[i].title}](${feed.items[i].link})`);
                }
                
                message.channel.send(embed);
            })();
            
            return;
        }
        
        (async () => {
            let feed = await parser.parseURL(RSS_URL);            
            let pages = [];
            
            for (i = 0; i < 10; i++) {
                pages[i] = new MessageEmbed()
                .setColor(config.embedColor)
                .setTitle(feed.title)
                .setImage(feed.image.url)
                .setAuthor(config.name, config.avatar)
                .setDescription(`**${feed.items[i].title}**`)
                .addField('Summary', feed.items[i].contentSnippet)
                .addField('Published', feed.items[i].pubDate, true)
                .addField('Link', feed.items[i].guid, true)
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
        })();
    }
};