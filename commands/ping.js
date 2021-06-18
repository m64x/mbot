module.exports = {
  name: 'ping',
  description: 'ping',
  execute(message, args) {
    message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
  }
};