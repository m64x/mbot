module.exports = {
  name: 'dice',
  cooldown: 1,
  execute(message, args) {
    const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    if (!args.length) return message.channel.send(randomRange(1, 6));

    if (args.length === 1) {
      return message.channel.send(randomRange(0, args[0]));
    }
  }
};