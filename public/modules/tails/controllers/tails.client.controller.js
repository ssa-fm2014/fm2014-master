'use strict';

// Tails controller
angular.module('tails').controller('TailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tails', 'Servers',
	function($scope, $stateParams, $location, Authentication, Tails, Servers ) {
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
		$scope.execute = function($sid, $path) {

			if($stateParams.source !== undefined){
				$stateParams.source.close();
			}
		
			$stateParams.source = new window.EventSource('/tails?sid='+$sid+'&path='+$path+'&fileName='+this.command+'&grepString='+this.grepString);	

			var handleCallback = function(msg){
				console.log('handleCallback');
				// console.log(msg.totalSize);
				var tailObject = {};
				tailObject = JSON.parse(msg.data);


				console.log(tailObject);
			};

			$stateParams.source.addEventListener('message', handleCallback, false);


			console.log('execute');
		};


		$scope.findServerList = function() {
			$scope.servers = Servers.query();
		};

		$scope.findDirectoryList = function($sid, $path) {
// this.command
// this.grepString
			var folderPath = '/home/kanghyuk/testLog';

			if($path === undefined){
				$scope.tails = Tails.query({
					sid : $sid,
					path : folderPath
				});
			}
			else{

				if($stateParams.source !== undefined){
					$stateParams.source.close();
				}
			
				$stateParams.source = new window.EventSource('/tails?sid='+$sid+'&path='+folderPath+'&fileName='+$path+'&grepString='+'');	

				var handleCallback = function(msg){
					console.log('handleCallback');
					// console.log(msg.totalSize);
					var tailObject = {};
					tailObject = JSON.parse(msg.data);

					if(tailObject.stats === 'RC'){
						$stateParams.source.close();

					}
					else if(tailObject.stats === 'Succ'){
						console.log('tailObject.stats : ' + tailObject.stats);
						var oldHtml = angular.element(document.querySelector('#content')).html();
						angular.element(document.querySelector('#content')).html(oldHtml+'<br>'+tailObject.totalString);		
					}
					console.log(tailObject);

		
					// angular.element(document.querySelector('#content')).text('test');
				};

				$stateParams.source.addEventListener('message', handleCallback, false);
			}




		};
	}
]);