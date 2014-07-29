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
   	   .state('viewTails', {
			url: '/tails/:tailId',
			templateUrl: 'modules/tails/views/list-tails.client.view.html'
		})
		;

	}
]);