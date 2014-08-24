'use strict';

//Setting up route
angular.module('tails').config(['$stateProvider',
	function($stateProvider) {
		// Tails state routing
		$stateProvider.
		state('listTails', {
			url: '/tails',
			templateUrl: 'modules/tails/views/list-tails.client.view.html'
		})
	   .state('mainTails', {
			url: '/tails/logmain',
			templateUrl: 'modules/tails/views/logmain-tail.client.view.html'
		})
  	   .state('sshTails', {
			url: '/tails/sshTail',
			templateUrl: 'modules/tails/views/list-servers.client.view.html'
		})
		;

	}
]);