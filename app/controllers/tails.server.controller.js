'use strict';

/**
 * Module dependencies.
 */
var  mongoose = require('mongoose'),
	 Tail = mongoose.model('Tail'),
     sys = require('sys'),
	 execCommand = require('child_process').exec;


/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Article already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * List of Files
 */

exports.execute = function(req, res) {
	console.log('exports.tail controller START');

	var command = req.body.command;

	execCommand(command, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		// sys.print('stderr: ' + stderr);

		var tails = req.body;

		var tailObject = {};

		tailObject.log = stdout;

		res.jsonp(tailObject);

		if (error !== null) {

			console.log('exec error: ' + error);
		}
	});
};


exports.executePost = function(req, res) {
	console.log('exports.executePost controller START');
	var tail = new Tail(req.body);
	tail.user = req.user;


	console.log(tail);

	tail.save(function(err){
		if(err) {
			return res.send(400, {
				message : getErrorMessage(err)
			});
		}else{
			res.jsonp(tail);
		}
	});
};


exports.read = function(req, res) {
	console.log(req.tail);

	var command = req.tail.command;

	execCommand(command, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		// sys.print('stderr: ' + stderr);

		var tailObject = {};

		tailObject.log = stdout;

		res.jsonp(tailObject);

		if (error !== null) {

			console.log('exec error: ' + error);
		}
	});
};


exports.tailByID = function(req, res, next, id) {
	Tail.findById(id).populate('user', 'displayName').exec(function(err, tail){
		if(err){ return next(err);}
		if(!tail){ return next(new Error('Failed to load tail ' + id));}
		req.tail = tail;
		next();
	});
};