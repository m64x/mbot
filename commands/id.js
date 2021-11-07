const config = require('../config.json');
const functions = require('../functions');

module.exports = {
    name: 'id',
    description: 'get user id',
    execute(message, args) {
        let userID = message.author.id;
        let adminID = config.adminID;

        message.channel.send(functions.isAdmin(userID));
    }
};