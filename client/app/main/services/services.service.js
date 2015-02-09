'use strict';

angular.module('meansibleApp')
	.service('Box', function($resource) {
		return $resource('/app/main/services/boxes.json', {}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	})
	
		// .factory('Boxes', ['$http', function($http){
		// 	var boxes = [];	
			
		// 	return {
		// 		get: function(){
		// 			if (boxes.length == 0){
		// 				$http.get('/app/main/services/boxes.json')
		// 					.success(function(response){
		// 						for(var i = 0, ii = response.length; i < ii; i++){
		// 							boxes.push(response[i]);
		// 						}
		// 					})
		// 					.error(function(err){
		// 						alert(err);
		// 					});
		// 			}
		// 			return boxes;
		// 		}
		// 	}
		// }])

// Service for Node Versions
.service('NodeVersions', function($resource) {
	return $resource('/app/main/services/npm-versions.json', {}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})

// Generate Script and Download
.service('ScriptDownload', ['$resource', function($resource) {
	return $resource('/api/things/', {}, {
		get: {
			method: 'GET',
			isArray: false
		},
		download: {
			method: 'POST'
		}
	});
}])
