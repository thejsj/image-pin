/*global angular:true */
(function () {
  'use strict';
  angular.module('imagePin', [
      'ui.router',
      'wu.masonry',
      'angularFileUpload',
      'btford.socket-io',
      'bindtable',
      'angularMoment',
      'imagePin.services',
      'imagePin.home',
      'imagePin.user',
      'imagePin.single',
      'imagePin.header',
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      // $locationProvider.html5Mode(true);
      var authenticated = ['$q', 'AuthFactory', function ($q, AuthFactory) {
        var deferred = $q.defer();
        console.log('Authenticated');
        AuthFactory.isLoggedIn(false)
          .then(function (isLoggedIn) {
            console.log('isLoggedIn');
            console.log(isLoggedIn);
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
        })
        .state('single', {
          url: '/single/:id',
          templateUrl: '/app/single/single.html',
          resolve: {
            authenticated: authenticated
          }
        })
        .state('user', {
          url: '/user/:userId',
          templateUrl: '/app/user/user.html',
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
