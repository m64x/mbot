module.exports = {
    name: 'coin',
    cooldown: 1,
    execute(message, args) {
      // const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      // let random = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

      let result = Math.floor(Math.random() * (1 - 0 + 1)) + 0 ? 'cap' : 'pajură';
      message.channel.send(result);
    }
  };