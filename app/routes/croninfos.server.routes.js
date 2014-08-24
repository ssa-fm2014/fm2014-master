'use strict';

/**
 * Module dependencies.
 */
var users      = require('../../app/controllers/users'),
	croninfos  = require('../../app/controllers/croninfos');

module.exports = function(app) {
	app.route('/croninfos')
		.get(croninfos.list);
	
	app.route('/croninfos/:serverId/:path')
		.get(croninfos.read)
		.post(users.requiresLogin, croninfos.create)
		.put(users.requiresLogin, croninfos.update)
		.delete(users.requiresLogin, croninfos.delete);
	
	//app.param('serverId', croninfos.serverId);
	//app.param('path', 	  croninfos.path);
};