'use strict';

//Tails service used to communicate Tails REST endpoints
angular.module('tails').factory('Tails', ['$resource',
	function($resource) {
		return $resource('tails/:tailId', { tailId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);