const fetch = require('node-fetch');

module.exports = {
    name: 'news',
    aliases: ['n'],
    description: 'news from nytimes',
    execute(message) {
        
        const apikey = process.env.nytimes;
        const url = `https://api.nytimes.com/svc/topstories/v2/us.json?api-key=${apikey}`;
        
        async function foo() {
            try {
                const res = await fetch(url);
                const result = await res.json();
                
                console.log(result.results[0]);
                message.channel.send(result.results[0]);
            } catch(e) {
                console.log(e);
                message.channel.send({files: [process.env.KT]});
            }
        }
        
        foo();
        
    }
};

