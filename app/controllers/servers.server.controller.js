'use strict';

/**
 * Module dependencies.
 */

/**
 * List of Directorys
 */
exports.list = function(req, res) {
		
	var serverList = [];
		
	serverList.push({'id' : 'server1', 'name' : '테스트 서버', 'ip':'192.168.0.94', 'port' : '22'});
	serverList.push({'id' : 'server2', 'name' : '개발 서버',   'ip':'192.168.0.94', 'port' : '22'});
	serverList.push({'id' : 'server3', 'name' : '운영 서버',   'ip':'192.168.0.94', 'port' : '22'});
	
	res.jsonp(serverList);
};
