/*global angular:true */

(function () {
  'use strict';
  angular.module('imagePin.home')
    .controller('addImageFormController', ['$scope', '$modalInstance', 'AuthFactory', 'ImageFactory', addImageFormController]);

  function addImageFormController ($scope, $modalInstance, AuthFactory, ImageFactory) {
    $scope.files = null;

    $scope.closeModal = function () {
      AuthFactory.getUserName()
        .then(function (user) {
          return ImageFactory.uploadImage(user.userId, $scope.title, $scope.files);
        })
        .then(function (res) {
          $modalInstance.close();
        });
    };

    $scope.onFileSelect = function (files) {
      $scope.files = files;
    };
  }

})();
