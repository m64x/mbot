module.exports = {
    name: 'id',
    description: 'get user id',
    execute(client, message, args) {
        let x = client.users.cache.find(u => u.tag === 'Mădălin#8114').id

        message.channel.send(x || typeof x);
    }
};