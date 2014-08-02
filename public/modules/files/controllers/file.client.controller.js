'use strict';

angular.module('files').controller('FileController', ['$scope', '$stateParams', '$location', 'Authentication', 'Files',
	function($scope, $stateParams, $location, Authentication, Files) {
		$scope.authentication = Authentication;

		$scope.find = function($path, $name, $parent) {
			$scope.files = Files.query({
				path : $path,
				name : $name,
				parent : $parent
			});
			
			$scope.file = Files.get({
				path: $stateParams.path
			});
			
			console.log($scope);
			//this.minute = $path;
		};
		
		$scope.create = function() {
			var file = new Files({
				path   : this.path,
				minute : this.minute,
				hour   : this.hour,
				day    : this.day,
				month  : this.month,
				week   : this.week,
				command: this.command
			});
			
			file.$save(function(response) {
				$location.path('files');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);