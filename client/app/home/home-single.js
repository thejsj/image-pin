/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.homeSingle', [])
    .controller('HomeSingleController', HomeSingleController);

  HomeSingleController.$inject = ['$scope', 'bindTable', 'AuthFactory', 'ImageFactory'];

  function HomeSingleController($scope, bindTable, AuthFactory, ImageFactory) {
    var vm = this;

    vm.init = function (card) {
      vm.card = card;
      vm.userId = null;
      vm.editMode = false;
      vm._showComments = false;
      $scope.title = card.title;
    };
    window.single = vm;

    vm.showComments = function () {
      vm._showComments = !vm._showComments;
    };

    vm.deleteImage = function (imageId) {
      ImageFactory.deleteImage(imageId);
    };

    vm.toggleEditMode = function () {
      vm.card.title = $scope.title;
      vm.editMode = !vm.editMode;
    };

    vm.updateTitle = function () {
      ImageFactory.updateTitle(vm.card.id, $scope.title)
        .then(function () {
          vm.toggleEditMode();
        });
    };

    vm.isLiked = function (likes, id) {
      return likes.indexOf(id) !== -1;
    };

    vm.likePin = function (imageId) {
      ImageFactory.likePin(imageId);
   };

    $scope.$watchCollection(function () {
      return vm.card;
    }, function () {
      console.log('Card Updated');
    });

  };

}());
