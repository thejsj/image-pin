/*global angular:true */
(function () {
  'use strict';
  angular.module('imagePin.header', [])
    .directive('ipheader', ['AuthFactory', function (AuthFactory) {
      console.log('Directive ipHeader!');
      var $scope = {};
      return {
        restrict: 'E',
        templateUrl: '/app/templates/header.html',
        $scope: $scope
      };
    }]);
})();
