'use strict';

// Setting up route
angular.module('directorys').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listDirectorys', {
			url: '/directorys',
			templateUrl: 'modules/directorys/views/directory-client-list.html'
		});
	}
]);

angular.module('servers').config(['$stateProvider',
 	function($stateProvider) {
 		// Articles state routing
 		$stateProvider.
 		state('listServers', {
 			url: '/servers',
 			templateUrl: 'modules/directorys/views/directory-client-list.html'
 		});
 	}
 ]);