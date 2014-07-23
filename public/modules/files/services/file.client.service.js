'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('directorys').factory('Files', ['$resource',
	function($resource) {
		return $resource('files', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);