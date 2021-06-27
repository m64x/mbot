const config = require('./config.json');

module.exports = {
	debug: function(stuff) {
	if (!config.debugMode) {
		console.log('[DEBUG] Debug mode is off!');
		return;
	}
		console.log('[DEBUG] ' + stuff);
   }
}
