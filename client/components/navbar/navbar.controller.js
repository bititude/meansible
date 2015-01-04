'use strict';

angular.module('meansibleApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'About',
      'link': '/about'
    },{
      'title': 'Docs',
      'link': '/docs'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
