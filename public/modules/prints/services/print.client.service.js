'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('prints').factory('Prints', ['$resource',
	function($resource) {
		return $resource('prints', {
			path: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);