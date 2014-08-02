'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('servers').factory('Servers', ['$resource',
	function($resource) {
		return $resource('servers', {
			path: '@_id'
		});
	}
]);