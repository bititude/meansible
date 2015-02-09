'use strict';

angular.module('meansibleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'app/main/about.html',
        controller: 'MainCtrl'
      })

      .state('docs', {
        url: '/docs',
        templateUrl: 'app/main/docs.html',
        controller: 'MainCtrl'
      });
  });