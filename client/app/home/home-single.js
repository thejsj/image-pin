/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.homeSingle', [])
    .controller('HomeSingleController', HomeSingleController);

  HomeSingleController.$inject = ['$scope', 'bindTable', 'AuthFactory'];

  function HomeSingleController($scope, bindTable, AuthFactory) {
    var vm = this;

    vm.init = function (id) {
      vm.id = id;
    };

    vm._showComments = false;

    vm.showComments = function () {
      console.log('showComments', vm._showComments);
      vm._showComments = !vm._showComments;
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
          console.log(images, imageId);
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
