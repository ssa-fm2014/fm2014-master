'use strict';

angular.module('directorys').controller('DirectoryController', 
		['$scope', '$stateParams', '$location', 'Authentication', 'Directorys', 'Servers',
	function($scope, $stateParams, $location, Authentication, Directorys, Servers) {
		$scope.authentication = Authentication;

		$scope.findServerList = function() {
			$scope.servers = Servers.query();
		};
		
		$scope.findDirectoryList = function($sid, $path) {
			$scope.directorys = Directorys.query({
				sid : $sid,
				path : $path
			});
		};
		
		$scope.create = function() {
			var directory = new Directorys({
				ip	   : this.ip,
				port   : this.port,
				path   : this.path,
				minute : this.minute,
				hour   : this.hour,
				day    : this.day,
				month  : this.month,
				week   : this.week,
				command: this.command
			});
			
			directory.$save(function(response) {
				$location.path('directorys');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);