'use strict';

angular.module('prints').controller('PrintController', 
		['$scope', '$stateParams', '$location', 'Authentication', 'Directorys', 'Servers',
	function($scope, $stateParams, $location, Authentication, Directorys, Servers) {
		$scope.authentication = Authentication;

		$scope.findServerList = function() {
			$scope.servers = Servers.query();
		};
	}
]);