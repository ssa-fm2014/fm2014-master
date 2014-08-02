'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('directorys').factory('Directorys', ['$resource',
	function($resource) {
		return $resource('directorys', {
			path: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);