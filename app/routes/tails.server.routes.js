'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var tails = require('../../app/controllers/tails');

	// Tails Routes
	app.route('/tails')
		.get(tails.controll)
		// .get(tails.execute)
		.post(tails.executePost);

	app.route('/tails/sshTail')
		.get(tails.list);

	// app.route('/tails/:tailId')
	// 	.get(tails.execute)
	// 	.post(tails.execute);


	// app.route('/tailspost')	
	// 	.post(tails.executePost);
	// Finish by binding the article middleware
	app.param('tailId', tails.tailByID);
};