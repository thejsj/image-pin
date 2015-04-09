/*global angular:true */
(function () {
  'use strict';
  angular.module('imagePin', [
      'ui.router',
      //'wu.masonry',
      'akoeing.deckgrid',
      'angularFileUpload',
      'btford.socket-io',
      'bindtable',
      'angularMoment',
      'imagePin.services',
      'imagePin.home',
      'imagePin.form',
      'imagePin.user',
      'imagePin.single',
      'imagePin.header',
    ])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
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
    }])
    .run(['$rootScope', '$state', function ($rootScope, $state) {
      $rootScope.$on('$stateChangeError', function (err, req) {
        $state.go('login');
      });
    }]);
})();
