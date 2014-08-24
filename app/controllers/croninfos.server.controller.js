'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Crontab = mongoose.model('Crontab'),
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
				message = 'Crontab already exists';
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
	var crontab = new Crontab(req.body);
	crontab.user = req.user;
	
	crontab.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(crontab);
		}
	});
};

/**
 * crontab middleware
 */
exports.crontabByPath= function(req, res) {
	var serverId = req.param('sid');
	var path = req.param('path');
	
	Crontab.findOne({'serverId':serverId, 'path':path}).populate('user', 'displayName').exec(function(err, crontab) {
		res.crontab = crontab;
	});
};

/**
 * Create a crontab
 */
exports.create = function(req, res) {
	var crontab = new Crontab(req.body);
	crontab.user = req.user;

	crontab.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(crontab);
		}
	});
};

/**
 * Show the current crontab
 */
exports.read = function(req, res) {
	res.jsonp(req.crontab);
};

/**
 * Update a crontab
 */
exports.update = function(req, res) {
	var crontab = req.crontab;

	crontab = _.extend(crontab, req.body);

	crontab.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(crontab);
		}
	});
};

/**
 * Delete an crontab
 */
exports.delete = function(req, res) {
	var crontab = req.crontab;

	crontab.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(crontab);
		}
	});
};

/**
 * List of Crontab
 */
exports.list = function(req, res) {
	Crontab.find().sort('-created').populate('user', 'displayName').exec(function(err, crontabs) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(crontabs);
		}
	});
};

/**
 * Crontab middleware
 */
exports.crontabByID = function(req, res, next, id) {
	Crontab.findById(id).populate('user', 'displayName').exec(function(err, crontab) {
		if (err) return next(err);
		if (!crontab) return next(new Error('Failed to load crontab ' + id));
		req.crontab = crontab;
		next();
	});
};

/**
 * Crontab authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.crontab.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};