'use strict';

angular.module('meansibleApp')
  .controller('MainCtrl', function ($scope, $http, $window, Box, NodeVersions, ScriptDownload) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.box = {selected: "0"};
    // Return Supported Box List
    Box.query(function (boxes) {
    	$scope.boxes = boxes;
        $scope.data.boxname = boxes[0].name;
    }); 	
    
    // Return Supported Node Versions
    NodeVersions.query(function(nodeversions){
    	$scope.versions = nodeversions;
    	$scope.version = {selected: nodeversions[0].name};
    });

    $scope.data = {
        "ports" : [
                { "guest": 80, "host": 8080 },
                { "guest": 9000, "host": 9090 },
                { "guest": 3000, "host": 3030 }
            ]
    };
    // Lets Download it
    $scope.fileDownload = function(data){   
        ScriptDownload.download(data, function(response){
            console.log("response",response.url);
            $window.location = response.url;
        });
    }
  });
