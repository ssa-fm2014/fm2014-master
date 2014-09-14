'use strict';

// Setting up route
angular.module('prints').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listPrints', {
			url: '/prints',
			templateUrl: 'modules/prints/views/print-client-list.html'
		});
	}
]);

