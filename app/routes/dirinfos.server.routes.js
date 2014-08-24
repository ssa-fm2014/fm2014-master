'use strict';

/**
 * Module dependencies.
 */
var users      = require('../../app/controllers/users'),
	dirinfos   = require('../../app/controllers/dirinfos');

module.exports = function(app) {

	app.route('/dirinfos')
		.get(dirinfos.list);
	
	app.route('/dirinfos/:serverId/:path')
		.get(dirinfos.read)
		.post(users.requiresLogin, dirinfos.create)
		.put(users.requiresLogin, dirinfos.update)
		.delete(users.requiresLogin, dirinfos.delete);
	
	//app.param('serverId', dirinfos.serverId);
	//app.param('path', 	  dirinfos.path);
};