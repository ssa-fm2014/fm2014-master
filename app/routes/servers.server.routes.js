'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
servers	= require('../../app/controllers/servers');
module.exports = function(app) {

	app.route('/servers')
		.get(servers.list);
};