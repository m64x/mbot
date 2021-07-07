const  googleIt = require('google-it');

module.exports = {
    name: 'google',
    aliases: ['g', 'gagle'],
    // cooldown: 5,
    execute(message, args) {
        if (!args.length) {
            message.channel.send('!g <search term>');
            return;
          }
 
          googleIt({'query': args.join()}).then(results => {
            console.log(results);
            message.channel.send(JSON.stringify(results));
          }).catch(e => {
            console.log('[ERROR] ' + e);
            // any possible errors that might have occurred (like no Internet connection)
          });
                  

    }
  };