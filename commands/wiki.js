const fetch = require('node-fetch');

module.exports = {
	name: 'wiki',
	description: 'get wiki articles. !wiki/!w for a random article.',
  aliases: ['w'],
	execute(message, args) {
    let url;
    let lang = 'en';

		if (!args.length) {
      url = `https://en.wikipedia.org/api/rest_v1/page/random/summary`;
		}

    if (args.length === 1) {
      if (args[0] === 'ro') {
        url = 'https://ro.wikipedia.org/api/rest_v1/page/random/summary';
      } else {
        // args.shift();
        url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${args[0]}`;
      }
    } else if (args.length > 1) {
      if (args[0] === 'ro') {
        args.shift();
        const termen = args.join('+');
        url = `https://ro.wikipedia.org/w/api.php?action=opensearch&search=${termen}`;
      } else {
        args.shift();
        const termen = args.join('+');
        url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${termen}`;
      }
    }


    // const url = `https://en.wikipedia.org/w/api.php?action=opensearch&prop=langlinks&search=${termen}&llprop=url&lllang=${lang}`;
    // const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=langlinks&titles=${termen}&llprop=url&lllang=${lang}`;

		async function foo() {
			try {
				const res = await fetch(url);
				const result = await res.json();

        console.log(url);
        console.log(result);
        let msg;

        if (!args.length || args[0] === 'ro' && args.length === 1) {
          msg = `${result.content_urls.desktop.page} - ${result.extract}`;
        } else {
          msg = result[3][0];
        }
        // let msg = result[3][0];
				message.channel.send(msg);
			} catch (e) {
				console.error(e);
				message.channel.send({files: [process.env.KT]});
				message.reply('Nu exista termenu\' asta, boule!');
			}
		}
		foo();
	}
};