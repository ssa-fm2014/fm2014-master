'use strict';

/**
 * Module dependencies.
 */
var users      = require('../../app/controllers/users'),
	directorys = require('../../app/controllers/directorys');

module.exports = function(app) {
	// Files Routes
	app.route('/directorys')
		.get(directorys.list);
};