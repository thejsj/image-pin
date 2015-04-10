/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.homeSingle', [])
    .controller('HomeSingleController', HomeSingleController);

  HomeSingleController.$inject = ['$scope', 'bindTable', 'AuthFactory'];

  function HomeSingleController($scope, bindTable, AuthFactory) {
    var vm = this;

    vm.init = function (card) {
      vm.id = card.id;
      vm.userId = null;
      vm.editMode = false;
      $scope.title = card.title;
    };

    // Get user id
    AuthFactory.getUserName()
      .then(function (user) {
        vm.userId = user.userId;
      });

    vm._showComments = false;

    vm.showComments = function () {
      vm._showComments = !vm._showComments;
    };

    vm.deleteImage = function (imageId) {
      window.imagesTable.delete({
        id: imageId
      });
    };

    vm.toggleEditMode = function () {
      vm.editMode = !vm.editMode;
    };

    vm.updateComment = function () {
      AuthFactory.getUserName()
        .then(function (user) {
            getImage(vm.id, function (image) {
              if (!image) return;
              image.title = $scope.title;
              window.imagesTable
                .update(image);
              vm.toggleEditMode();
            });
          });
    };

    vm.isLiked = function (likes, id) {
      return likes.indexOf(id) !== -1;
    };

    var getImage = function (imageId, cb) {
      var imageIndex = _.findIndex(window.images, {'id': imageId});
      if (imageIndex !== -1) {
        return cb(window.images[imageIndex]);
      }
      return cb(false);
    };

    vm.likePin = function (imageId) {
      AuthFactory.getUserName()
        .then(function (user) {
            getImage(imageId, function (image) {
              if (!image) return;
              // TODO: Add contains
              if (_.contains(image.likes, user.userId)) return;
              image.likes.push(user.userId);
              window.imagesTable
                .update(image);
            });
          });
    };

  };

}());
