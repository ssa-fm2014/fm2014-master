'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var url = require('url');
var mongoose = require('mongoose');
var	Files = mongoose.model('File');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'File already exists';
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
	var file = new Files(req.body);
	file.user = req.user;
	
	file.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(file);
		}
	});
	
};

/**
 * List of Files
 */
exports.list = function(req, res) {
	var path = '';
	var reqPath = req.param('path');
	var reqName = req.param('name');
	var reqParent = req.param('parent');
	
	if(reqPath === null || reqPath === undefined) {
		reqPath = '/';
	}
	if(reqName === null || reqName === undefined) {
		reqName = '';
	}

	if(reqPath === '.') {
		if(reqName === '') {
			path = reqParent.substring(0, reqParent.lastIndexOf('/'));
			reqParent = path.substring(0, path.lastIndexOf('/'));
		}
		else {
			path = reqParent;
		}
	}
	else {
		path = reqPath;
		path += (reqPath==='/') ? '' : '/';
		path += reqName;
	}
	
	if(path === '') {
		path = '/';
	}
	
	console.log('path : ' + reqPath);
	console.log('name : ' + reqName);
	console.log('parent : ' + reqParent);
	console.log('real path : ' + path);
	
	fs.readdir(path, function(err, dirs) {
		if (err)
			throw err;
		
		var dirObj = [];
		
		if(path !== '/') {
			dirObj.push({'path' : reqPath, 'name':'', 'parent' : reqParent});
		}
		
		dirs.forEach(function(dir) {
			if(fs.statSync(path +'/'+ dir).isDirectory()) {
		    	dirObj.push({'path' : path , 'name' : dir, 'parent' : reqParent});
		    }
		});

		res.jsonp(dirObj);
	});
};

/**
 * file middleware
 */
exports.fileByPath= function(req, res, next, id) {
	Files.findById(id).populate('user', 'displayName').exec(function(err, file) {
		if (err) return next(err);
		if (!file) return next(new Error('Failed to load file ' + id));
		req.file = file;
		next();
	});
};
