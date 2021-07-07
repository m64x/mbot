const googleIt = require('google-it');

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
        googleIt({'query': args.join(" "), 'disableConsole': true}).then(results => {
          console.log(results);
          results.forEach(function(item, index) { 
            console.log(item);
            message.channel.send(item.link);
            // embed.addField((index + 1) + ". " + item.title, "<" + item.link + ">");
          });
          message.channel.send(JSON.stringify(results));
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