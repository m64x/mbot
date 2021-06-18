const fs = require('fs');
let config = JSON.parse(fs.readFileSync("./config.json"));

module.exports = {
  name: 'bot',
  aliases: ['mbot'],
  description: 'manage bot options',
  execute(message, args) {
    if (!args.length) {
      message.channel.send('beep boop. i\'m a bot.');
      return;
    }

    let isAdmin = () => {
      author = parseInt(message.author.id);
      admin = parseInt(process.env.adminid);

      return author === admin;
    };

    if (args[0] === 'version') {
      // Get bot version
      botVersion = config['version'];

      if (args.length === 1) {
        return message.channel.send('mBot version: `' + botVersion + '`');
      }

      if (!isAdmin) return message.reply('you don\'t have the permission to change the version');

      if (args.length === 3) {
        if (args[1] === 'increment' || args[1] === 'i' || args[1] === 'up') {
          let v = botVersion.split('.');

          if (args[2] === 'major') {
            v[0]++;
            v[1] = 0;
          } else if (args[2] === 'minor') {
            v[1]++;
            v[2] = 0;
          } else if (args[2] === 'patch') {
            v[2]++
          }
          v = v.join('.');

          config['version'] = v;
        const json = JSON.stringify(config);
      
      fs.writeFile('./config.json', json, (err) => {
        if (err) {
          console.log(err);
        } else {
          message.channel.send(`Bot version: \`${v}\` `);
            message.client.user.setPresence({
              status: 'online',
              activity: {
              name: `mBot v${v}`,
            }
          });
        }
      });
        } else if (args[1] === 'set') {
          v = args[2];
          config['version'] = v;
        const json = JSON.stringify(config);
      
      fs.writeFile('./config.json', json, (err) => {
        if (err) {
          console.log(err);
        } else {
          message.channel.send(`Bot version: \`${v}\` `);
            message.client.user.setPresence({
              status: 'online',
              activity: {
              name: `mBot v${v}`,
            }
          });
        }
      });
        }
      }

    } else if (args[0] === 'id') {
        message.channel.send(message.author.id);
    } else if (args[0] === 'avatar') {
      if (args.length === 1) {
        return message.channel.send(message.client.user.displayAvatarURL());
      }
      
      // try {
        message.client.user.setAvatar(args[1]);
        message.channel.send('Avatarul a fost setat.');
      // } catch(e) {
        // message.reply(e);
        // console.log(e);
      // }
    }
  }
};