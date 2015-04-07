/*global angular:true */
(function () {
  'use strict';
  angular.module('imagePin.header', [])
    .directive('ipheader', ['AuthFactory', function (AuthFactory) {
      var $scope = {};
      return {
        restrict: 'E',
        templateUrl: '/app/templates/header.html',
        $scope: $scope
      };
    }]);
})();
