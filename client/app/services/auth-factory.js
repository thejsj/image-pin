/*global angular:true, moment:true, _:true */
(function () {
  'use strict';
  angular.module('imagePin.services', [])
    .factory('AuthFactory', AuthFactory)
    .factory('socket', function(socketFactory){
      return socketFactory();
    })
    .factory('bindTable', function(bindTableFactory, socket){
      return bindTableFactory({socket: socket});
    });

  AuthFactory.$inject = ['$http', '$state', '$q'];

  function AuthFactory($http, $state, $q) {

    var factory = {
      user: null,
      isLoggedIn: isLoggedIn,
      getUserName: getUserName
    };

    return factory;

    function isLoggedIn(redirectToLogin) {
      if (factory.user !== null) {
        return $q.when(factory.user);
      }
      return $http.get('/api/auth/user')
        .then(function (res) {
           factory.user = {
            userId: res.data.userId,
            userName: res.data.userName,
            githubAvatarUrl: res.data.githubAvatarUrl
          };
          if (res.data.userId === null) {
            if (redirectToLogin !== false) {
              return $state.go('login');
            }
            return false;
          }
          return factory.user;
        });
    }

    function getUserName() {
      if (factory.user === undefined) {
        return factory.isLoggedIn();
      } else {
        return $q.when(factory.user);
      }
    }

  }

})();
