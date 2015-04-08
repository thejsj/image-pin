/*global angular:true */
(function () {
  'use strict';
  angular.module('imagePin.header', [])
    .directive('ipheader', ['AuthFactory', function (AuthFactory) {
      var $scope = {};
      return {
        restrict: 'E',
        templateUrl: '/app/templates/header.html',
        $scope: {
          showLogout: '&'
        },
        link: function (scope, element, attr) {
          if (attr.showLogout !== undefined && attr.showLogout === 'false') {
            $scope.showLogout = false;
          } else {
            $scope.showLogout = true;
          }
        }
      };
    }]);
})();
