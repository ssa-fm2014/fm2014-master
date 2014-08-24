'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('croninfos').factory('Croninfos', ['$resource',
	function($resource) {
		return $resource('croninfos', {
			path: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);