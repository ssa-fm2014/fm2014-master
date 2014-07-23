'use strict';

angular.module('directorys').controller('FileController', ['$scope', '$stateParams', '$location', 'Authentication', 'Files',
	function($scope, $stateParams, $location, Authentication, Files) {
		$scope.authentication = Authentication;

		$scope.find = function() {
			$scope.directorys = Files.query();
		};
		
		$scope.findByPath = function($path) {
			alert($path);
			$scope.directorys = Files.get({
				path: $path
			});
		};
	}
]);