'use strict';

angular.module('meansibleApp')
  .controller('MainCtrl', function ($scope, $http, Box, NodeVersions) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.box = {selected: "0"};
    // Return Supported Box List
    Box.query(function (boxes) {
    	$scope.boxes = boxes;
        $scope.box = {selected: boxes[0].name};
    }); 	
    
    // Return Supported Node Versions
    NodeVersions.query(function(nodeversions){
    	$scope.versions = nodeversions;
    	$scope.version = {selected: nodeversions[0].name};
    });


  });
