// const fetch = require('node-fetch');
const axios = require('axios');

if (!timer) {
  var timer = [];
}

module.exports = {
  name: 'crypto',
  aliases: ['cripto'],
  description: 'get cripto price',
  args: true,
  cooldown: 10,
  usage: '<criptomoneda> ?<moneda conversie (default = usd)> ?<repeat> ?<interval-minute>',
  execute(message, args) {
    let id = message.channel.id;
    let repeat;
    const minRepeat = 10;
    const apikey = process.env['CRYPTO_KEY'];
    let url;

    // Defaults to USD
    if (args.length === 1) {
      url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${apikey}&symbol=${args[0]}`;
    } else if (args.length === 2) {
      url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${apikey}&symbol=${args[0]}&convert=${args[1]}`;
    } else {
      message.reply('pula-n cur.');
    }

    const messages = {
      notFound: 'Nu există această monedă.',
      timerRunning: 'Timerul rulează',
      timerNotRunning: 'Timerul nu rulează',
      timerStopped: 'Timerul a fost oprit.',
      timerAlreadyStopped: 'Timerul a fost deja oprit.',
      timerAlreadyRunning: 'Timerul rulează deja.',
      missingRepeatArgument: 'Introdu numărul de minute pentru a repeta comanda.',
      timerSet: (min) => `Timer pornit. Comanda va fi afișată la intervalul de ${min} ${plural('minut', 'minute', min)}. Foloseste !btc stop pentru a opri timerul.`
    };

    const plural = (termSingular, termPlural, count) => {
      return count === 1 ? `${count} ${termSingular}` : `${count} ${termPlural}`;
    };

    // function plural(termSingular, termPlural, count) {
    //   return count === 1 ? termSingular : termPlural;
    // }

    const isNumeric = (string) => {
      if (typeof string != "string") return false;
      return !isNaN(string) && !isNaN(parseFloat(string));      
    };

    // function isNumeric(str) {
    //   if (typeof str != "string") return false;
    //   return !isNaN(str) && !isNaN(parseFloat(str));
    // }

    function numberWithSeparators(number, separator) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    switch (args.length) {
      case 1:
        if (args[0] === 'stop') {
          if (timer[id]) {
            clearInterval(timer[id]);
            timer[id] = null;
            message.reply(messages.timerStopped);
          } else {
            message.reply(messages.timerAlreadyStopped);
            return;
          }
        } else if (args[0] === 'check') {
          if (timer[id]) {
            message.reply(messages.timerRunning);
            return;
          } else {
            message.reply(messages.timerNotRunning);
            return;
          }
        } else if(args[0] === 'top') {

        } else {
          foo();
        }
        break;
      case 3:
        if (args[1] === 'repeat') {
          repeat = 10;
        } else {
          foo();
        }
        break;
      case 4:
        if (args[1] === 'repeat') {
          if (timer[id]) {
            message.reply(messages.timerAlreadyRunning);
            return;
          }

          if (!isNumeric(args[2])) return message.reply(messages.missingRepeatArgument);

          let repeatMinutes = parseInt(args[2]);
          if (repeatMinutes < minRepeat) return message.reply(`the minimum interval is ${minInterval} minutes.`);
            message.channel.send(messages.timerSet(repeatMinutes));
            foo(true);
            timer[id] = setInterval(foo, repeatMinutes * 60000, true);
        }
        break;
    }

    async function foo(repeat) {
      try {
        const result = await axios.get(url);
        const data = result.data.data[args[0].toUpperCase()];
        console.log(url);
        console.log(result);
        datax = args[1] ? data.quote[args[1].toUpperCase()] : data.quote.USD;
        let x = datax.price;
        x = x.toFixed(2);
        x = numberWithSeparators(x, ',');
        let moneda = args[1] ? args[1].toUpperCase() : 'USD';
        let upDown24hEmoji = datax.percent_change_24h.toFixed(2) > 0 ? "⬆" : "⬇";
        let upDown7dEmoji = datax.percent_change_7d.toFixed(2) > 0 ? "⬆" : "⬇";
        let msg1 = `1 ${args[0].toUpperCase()} = ${x} ${moneda}\n
24h: ${upDown24hEmoji} ${datax.percent_change_24h.toFixed(2)} %\n 7 zile: ${upDown7dEmoji} ${datax.percent_change_7d.toFixed(2)} %`;
        message.channel.send(msg1).then(msg => {
          if (repeat) {
            msg.react('⏰');
          // msg.react('');
          }
        });
      } catch (e) {
        console.log(e);
        message.channel.send(process.env.KT);
        message.reply(messages.notFound);
      }
    }
  }
};