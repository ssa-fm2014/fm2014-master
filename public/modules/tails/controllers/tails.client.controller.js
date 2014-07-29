'use strict';

// Tails controller
angular.module('tails').controller('TailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tails',
	function($scope, $stateParams, $location, Authentication, Tails ) {
		$scope.authentication = Authentication;


		$scope.find = function() {
			$scope.tails = Tails.query();
		};
		// Find existing Tail
		$scope.findLog = function($log) {
			$scope.tail = Tails.get({
				log: $log
			});
		};

		$scope.findOne = function() {
			$scope.tail = Tails.get({
				tailId: $stateParams.tailId
			});
		};

		// Execute Command
		$scope.execute = function() {
			// $location.path('tails?command="'+this.command+'"');
			// $stateParams.comand = this.command;
			var tail = new Tails({
				command: this.command
			});


			tail.$save(function(response) {
				console.log(response);
				$location.path('tails/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


			// $scope.tail = tail;

			// console.log('좀 보자!! 이거 나오는줄 알았으면 고생안했지 아마? ㅋㅋㅋ START');
			// console.log('$scope');
			// console.log($scope);

			// console.log('$stateParams');
			// console.log($stateParams);

			// console.log('$location');
			// console.log($location);

			// console.log('Tails');
			// console.log(Tails);

			// console.log('this');
			// console.log(this);

			// console.log('좀 보자!! 이거 나오는줄 알았으면 고생안했지 아마? ㅋㅋㅋ START');

			// Tails.body = {aaa : 'aaa'};

			// $location.path('tails');
		};


	}
]);