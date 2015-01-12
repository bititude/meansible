'use strict';

angular.module('meansibleApp')
  .controller('MainCtrl', function($scope, $http, $window, Box, NodeVersions, ScriptDownload) {

    $scope.awesomeThings = [];
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.box = {
      selected: "0"
    };

    $scope.installMongo = true;
    $scope.roleChanged = function(data){
      console.log("role changed " + data)
      if(data){
        $scope.data.roles.push('mongo');
      } else {
        _.remove($scope.data.roles,function(item){
            return item == 'mongo'
        });
      }
    }

    // Return Supported Box List
    Box.query(function(boxes) {
      $scope.boxes = boxes;
      $scope.data.boxname = boxes[0].name;
    });

    // Return Supported Node Versions
    NodeVersions.query(function(nodeversions) {
      $scope.versions = nodeversions;
      $scope.data.version = nodeversions[0].name;
    });

    $scope.data = {
      "ports": [{
        "guest": 80,
        "host": 8080
      }, {
        "guest": 9000,
        "host": 9090
      }, {
        "guest": 3000,
        "host": 3030
      }],
      "defaultPackages":["git","curl","build-essential","libssl-dev","python-software-properties"],
      "roles":["mongo","nvm","npm"],
      "nodeMethod": "NVM"
    };

    // Lets Download it
    $scope.fileDownload = function(data) {
      ScriptDownload.download(data, function(response) {
        console.log("response", response.url);
        $window.location = response.url;
      });
    }
  });
