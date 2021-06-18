const fetch = require('node-fetch');
module.exports = {
  name: 'catfact',
	aliases: ['catsfact'],
	description: 'facts about cats',
  execute(message) {

    const url = 'https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1';

    async function foo() {
			try {
				const res = await fetch(url);
				const result = await res.json();

				console.log(result);
				message.channel.send(result.text);
			} catch(e) {
				console.log(e);
				message.channel.send({files: [process.env.KT]});
			}
		}

  foo();

  }
};