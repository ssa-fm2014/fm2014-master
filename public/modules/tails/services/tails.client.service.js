'use strict';

//Tails service used to communicate Tails REST endpoints
angular.module('tails').factory('Tails', ['$resource',
	function($resource) {
		// var sse = new EventSource('/tail');
		return $resource('tails/:tailId', { tailId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
// angular.module('foo', []).factory('sse', function($rootScope) {
//   var sse = new EventSource('/stream');
//   return {
//     addEventListener: function(eventName, callback) {
//       sse.addEventListener(eventName, function() {
//         // var args = arguments;
//         // $rootScope.$apply(function () {
//         //   callback.apply(sse, args);
//         // });
//       });
//     }
//   };
// });
// angular.module('Sse').factory('Sse', ['$resource',
// 	function($resource) {
// 		return new EventSource('/tail');
// 	}
// ]);

