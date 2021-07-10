const fetch = require('node-fetch');
const config = require('../config.json');

const f = require('../functions');

const paginationEmbed = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');

module.exports = {
    name: 'dex',
    aliases: ['dexonline', 'dictionar'],
    description: 'Use the dexonline.ro API for definitions.',
    args: true,
    usage: '<daily/term>',
    execute(message, args) {
        const term = args.join('+');
        let url;
        
        if (args[0] === 'daily') {
            url = 'https://dexonline.ro/cuvantul-zilei/json';
        } else {
            url = `https://dexonline.ro/definitie/${term}/json`;
        }
        
        async function foo() {
            try {
                const res = await fetch(url);
                const result = await res.json();
                
                if (args[0] === 'daily') {
                    message.channel.send('Cuvantul zilei: `'+result.requested.record.word+'`. \nDefinitie: ' + result.requested.record.definition.internalRep);
                    message.channel.send(result.requested.record.image);
                    return;
                }
                
                f.debug(result.definitions[0].internalRep);
                
                const definitionsCount = result.definitions.length;

                if (definitionsCount) {
                    message.channel.send('Există un număr de **' + definitionsCount + ' definitii** pentru termenul **' + term + '**.');
                }
                
                let pages = [];
                
                for (i = 0; i < 5; i++) {
                    pages[i] = new MessageEmbed()
                    .setColor(config.embedColor)
                    .setTitle(`Definiția termenului **${term}**. ${i + 1}/5`)
                    .setAuthor('mBot', 'https://i.imgur.com/wSTFkRM.png')
                    .setDescription(result.definitions[i].internalRep)
                    .addField('Dicționar', result.definitions[i].sourceName, true)
                    .setTimestamp()
                    .setFooter('mBot v0.1.0', 'https://i.imgur.com/wSTFkRM.png');
                }
                
                let page = 0;
                let m = `${pages[page]} \n Page ${page} of ${pages.length}.`;
                
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
                            m = `${pages[page]} \n Page ${page} of ${pages.length}`;
                            msg.edit(pages[page]);
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        });
                        
                        forwards.on('collect', (r, u) => {
                            if (page === pages.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                            page++
                            m = `${pages[page]} \n Page ${page} of ${pages.length}.`;
                            msg.edit(pages[page]);
                            r.users.remove(r.users.cache.filter(u => u === message.author).first());
                        });
                    })
                });
                
            } catch(e) {
                console.log(e);
                message.channel.send(`Termenul ${term} nu există în niciun dicționar.`);
            }
        }
        
        foo();
        
    }
};
