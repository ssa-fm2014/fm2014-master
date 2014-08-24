'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('dirinfos').factory('Dirinfos', ['$resource',
	function($resource) {
		return $resource('dirinfos', {
			path: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);