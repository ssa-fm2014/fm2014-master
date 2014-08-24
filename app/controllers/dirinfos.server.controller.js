'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Directory = mongoose.model('Directory'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Directory already exists';
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


exports.create = function(req, res) {
	var directory = new Directory(req.body);
	directory.user = req.user;
	
	directory.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(directory);
		}
	});
};

/**
 * directory middleware
 */
exports.directoryByPath= function(req, res) {
	var serverId = req.param('sid');
	var path = req.param('path');
	
	Directory.findOne({'serverId':serverId, 'path':path}).populate('user', 'displayName').exec(function(err, directory) {
		res.directory = directory;
	});
};

/**
 * Create a directory
 */
exports.create = function(req, res) {
	var directory = new Directory(req.body);
	directory.user = req.user;

	directory.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(directory);
		}
	});
};

/**
 * Show the current directory
 */
exports.read = function(req, res) {
	res.jsonp(req.directory);
};

/**
 * Update a directory
 */
exports.update = function(req, res) {
	var directory = req.directory;

	directory = _.extend(directory, req.body);

	directory.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(directory);
		}
	});
};

/**
 * Delete an directory
 */
exports.delete = function(req, res) {
	var directory = req.directory;

	directory.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(directory);
		}
	});
};

/**
 * List of Directory
 */
exports.list = function(req, res) {
	Directory.find().sort('-created').populate('user', 'displayName').exec(function(err, directorys) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(directorys);
		}
	});
};

/**
 * Directory middleware
 */
exports.directoryByID = function(req, res, next, id) {
	Directory.findById(id).populate('user', 'displayName').exec(function(err, directory) {
		if (err) return next(err);
		if (!directory) return next(new Error('Failed to load directory ' + id));
		req.directory = directory;
		next();
	});
};

/**
 * Directory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.directory.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};