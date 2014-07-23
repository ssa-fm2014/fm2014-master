'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	files = require('../../app/controllers/files');

module.exports = function(app) {
	// Article Routes
	app.route('/files')
		.get(files.list);
};