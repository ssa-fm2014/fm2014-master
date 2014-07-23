'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');

/**
 * List of Files
 */
exports.list = function(req, res) {
	var path = '/';
	fs.readdir(path, function(err, directorys) {
		if (err)
			throw err;
		
		var dirObj = [];
		directorys.forEach(function(dir) {
			dirObj.push({'path' : path + dir});
		});
		
		res.jsonp(dirObj);
	});
};