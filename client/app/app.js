/*global angular:true */
(function () {
  'use strict';
  angular.module('imagePin', [
      'ui.router',
      'wu.masonry',
      'angularFileUpload',
      'btford.socket-io',
      'bindtable',
      'imagePin.services',
      'imagePin.home',
      // 'ngSocket'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      // $locationProvider.html5Mode(true);
      var authenticated = ['$q', 'AuthFactory', function ($q, AuthFactory) {
        var deferred = $q.defer();
        AuthFactory.isLoggedIn(false)
          .then(function (isLoggedIn) {
            if (isLoggedIn) {
              deferred.resolve();
            } else {
              deferred.reject('Not logged in');
            }
          });
        return deferred.promise;
      }];
      $stateProvider
        .state('login', {
          templateUrl: '/app/login/login.html',
          url: '/login',
        })
        .state('home', {
          url: '/',
          templateUrl: '/app/home/home.html',
          resolve: {
            authenticated: authenticated
          }
        });
    })
    .run(function ($rootScope, $state) {
      $rootScope.$on('$stateChangeError', function (err, req) {
        $state.go('login');
      });
    });
})();
