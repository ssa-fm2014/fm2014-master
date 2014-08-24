'use strict';

// Setting up route
angular.module('directorys').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listDirectorys', {
			url: '/directorys',
			templateUrl: 'modules/directorys/views/directory-client-list.html'
		});
	}
]);

angular.module('dirinfos').config(['$stateProvider',
 	function($stateProvider) {
 		$stateProvider.
 		state('listDirInfos', {
 			url: '/dirinfos',
 			templateUrl: 'modules/directorys/views/dirinfo-client-list.html'
 		});
 	}
]);
angular.module('croninfos').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listCrontabs', {
			url: '/croninfos',
			templateUrl: 'modules/directorys/views/crontab-client-list.html'
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