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


		$scope.tailStop = function() {
			console.log('sse 중지');
			if($stateParams.source !== undefined){
				$stateParams.source.close();
			}
			if($stateParams.reTrySource !== undefined){
				$stateParams.reTrySource.close();
			}
		};

		$scope.tailCopy = function() {
			console.log('prompt 실행');
			window.prompt('Ctrl + C 을 눌러 복사해주세요.', angular.element(document.querySelector('#content')).text());		

		};

		$scope.tailClear = function() {
			console.log('clear 실행');
			angular.element(document.querySelector('#content')).html('');
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

			var grepString = angular.element(document.querySelector('#grepString')).val();
			console.log($path);
			console.log(grepString);
			if($path === undefined){
				$scope.tails = Tails.query({
					sid : $sid
				});
			}
			else{

				if($stateParams.source !== undefined){
					$stateParams.source.close();
					$scope.tailClear();

				}
				if($stateParams.reTrySource !== undefined){
					$stateParams.reTrySource.close();
					$scope.tailClear();
				}


				console.log($sid);
				$stateParams.source = new window.EventSource('/tails?sid='+$sid+'&fileName='+$path+'&grepString='+grepString);	

				var handleCallback = function(msg){
					console.log('handleCallback');
					// console.log(msg.totalSize);
					var tailObject = {};
					tailObject = JSON.parse(msg.data);

					if(tailObject.stats === 'RC'){
						console.log('재연결합니다.');
						console.log('우선 연결을 끊습니다.');
						console.log(tailObject.totalSize);
						$stateParams.source.close();
						
						console.log('재연결을 시도합니다.');
						$stateParams.reTrySource = new window.EventSource('/tails?sid='+$sid+
							'&fileName='+$path+'&grepString='+grepString+'&totalSize='+tailObject.totalSize);	
						$stateParams.reTrySource.addEventListener('message', handleCallback, false);

						console.log('재연결 성공');
						// console.log('rc');

					}
					else if(tailObject.stats === 'Succ'){

						var dotString = '';

						if(grepString !== undefined && grepString !== '' && grepString !== null)
						{
							dotString = '<br>\n...' ;
						}
						

						console.log('tailObject.stats : ' + tailObject.stats);
						var oldHtml = angular.element(document.querySelector('#content')).html();
						if(tailObject.totalString.indexOf('error') > -1){
							// var splitStrings = tailObject.totalString.split('error');;
							// var resultString = '';
							// splitStrings.pop();
							// splitStrings.forEach(function(splitString) {
							// 	console.log('---------');
							// 	console.log(splitString);
							// 	console.log('---------');
							// });

							tailObject.totalString = tailObject.totalString.replace(/error/gi, '<div class="errorColor" >ERROR</div>');
							

							// re = /dream/i;
							// pos = src.search(re);
							// document.write(pos);
						}


						angular.element(document.querySelector('#content')).html(oldHtml+dotString+'\n<br>'+tailObject.totalString);		
					}
					console.log(tailObject);

				};

				$stateParams.source.addEventListener('message', handleCallback, false);
			}




		};
	}
]);