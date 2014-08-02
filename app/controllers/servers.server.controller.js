'use strict';

/**
 * Module dependencies.
 */

/**
 * List of Directorys
 */
exports.list = function(req, res) {
		
	var serverList = [];
		
	serverList.push({'name' : '테스트 서버', 'ip':'127.0.0.1', 'port' : '8080'});
	serverList.push({'name' : '개발 서버', 'ip':'127.0.0.1', 'port' : '8081'});
	serverList.push({'name' : '운영 서버', 'ip':'127.0.0.1', 'port' : '8082'});
	
	res.jsonp(serverList);
};
