/*global angular:true */

(function () {
  'use strict';
  angular.module('imagePin.home')
    .controller('addImageFormController', ['$scope', '$modalInstance', '$upload', addImageFormController]);

  function addImageFormController ($scope, $modalInstance, $upload) {
    $scope.files = null;


    $scope.closeModal = function () {
      $modalInstance.close();
    };

    $scope.onFileSelect = function (files) {
      $scope.files = files;
    };
  }

})();
