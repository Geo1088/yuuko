const {Command} = require('../../src/Command');

module.exports = new Command('reload', (msg, args, {client}) => {
	msg.channel.sendTyping();
	setTimeout(() => { // Delay by 100ms to make sure the sendTyping arrives first
		client.reloadCommands();
		msg.channel.createMessage('Reloaded commands.');
	}, 100);
}, {
	owner: true,
});
