'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var url = require('url');
var Connection = require('ssh2');
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

var parseResult = function(serverId, path, data) {
	var datasplits = [];
	var str='';
	for(var i=0; i<data.length; i++) {
		if(data[i] === '\n'){
			datasplits.push(str);
			str = '';
		}
		else{
			str += data[i];
		}
	}
	
	var result = [];
	if(path !== '/') {
		result.push({'name' : '..', 'path' : path+'..', 'serverId' : serverId});
		path += '/';
	}
	
	for(var k=0; k<datasplits.length; k++) {
		if(datasplits[k].charAt(0) === 'd' && datasplits[k].charAt(7) === 'r') {
			var dirinfo = datasplits[k].split(' ');
			var dirName = dirinfo[dirinfo.length -1];
			result.push({'name'    : dirName, 
						 'path'    : path+dirName, 
						 'serverId': serverId});
		}
	}
	return result;
};

var getConnectInfo = function(sid) {
	switch(sid) {
	case 'server1':
		return {host: 'kiup.dlinkddns.com',port: '7011',username: 'kiup',password: 'kiup1234'};
	case 'server2':
		return {host: 'kiup.dlinkddns.com',port: '7013',username: 'kanghyuk',password: 'abcd1234'};
	case 'server3':
		return {host: 'kiup.dlinkddns.com',port: '7015',username: 'kihoon',password: 'kihoon1234'};
	default :
		return {host: 'kiup.dlinkddns.com',port: '7011',username: 'kiup',password: 'kiup1234'};
	}
};

var myExec = function(conn, res, serverId, path) {
	var command = 'ls -l '+path;
	conn.exec(command, function(err, stream) {
		if (err) throw err;
		stream.on('data', function(data) {
			res.jsonp(parseResult(serverId, path, data.toString()));
		}).stderr.on('data', function(data) {
			console.log('STDERR: ' + data);
		});
	});
};

var connect = function(res, serverId, path) {
	var connection = new Connection();
	connection.on('connect', function() {
		console.log('Connection :: connect');
	});
	connection.on('ready', function() {
		console.log('Connection :: ready');
		
		myExec(connection, res, serverId, path);
	});
	connection.on('error', function(err) {
		console.log('Connection :: error :: ' + err);
	});
	connection.connect(getConnectInfo(serverId));
	return connection;
};

var connectionMap = {};
var connectionFactory = function(res, serverId, path) {
	var con = connectionMap[serverId];
	
	if(con === null || con === undefined) {
		var connection = connect(res, serverId, path);
		connectionMap[serverId] = connection;
	}
	else {
		myExec(con, res, serverId, path);
	}
};

/**
 * List of Directorys{
					sid : $sid,
					path : $path
				}
 */
exports.list = function(req, res) {
	var serverId = req.param('sid');
	var path = req.param('path');
	
	if(path === null || path === undefined) {
		path = '/';
	}
	if(path.indexOf('..') > 0) {
		var paths = path.split('/');
		paths.pop();
		path = '/' + paths.join('/');
	}
	
	connectionFactory(res, serverId, path);
};