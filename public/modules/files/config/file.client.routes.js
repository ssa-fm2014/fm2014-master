'use strict';

// Setting up route
angular.module('directorys').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listFiles', {
			url: '/files',
			templateUrl: 'modules/files/views/file-client-list.html'
		});
	}
]);