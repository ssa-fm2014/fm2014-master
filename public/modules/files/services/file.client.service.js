'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('files').factory('Files', ['$resource',
	function($resource) {
		return $resource('files', {
			path: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);