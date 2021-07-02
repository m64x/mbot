let google = require('google');

module.exports = {
    name: 'google',
    aliases: ['g', 'gagle'],
    // cooldown: 5,
    execute(message, args) {
        if (!args.length) {
            message.channel.send('!g <search term>');
            return;
          }
 
        google.resultsPerPage = 5;
        var nextCounter = 0;
         
        google(args.join('+'), function (err, res){
          if (err) console.error(err);
         
          for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            console.log(link.title + ' - ' + link.href)
            console.log(link.description + "\n")
          }
         
          if (nextCounter < 4) {
            nextCounter += 1
            if (res.next) res.next()
          }
        })
        

  
    }
  };