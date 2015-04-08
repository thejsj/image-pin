/*global angular:true, Blob: true, FileReader: true */

(function () {
  'use strict';
  angular.module('imagePin.user', ['ui.bootstrap'])
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$modal', 'bindTable', '$log', 'AuthFactory', '$stateParams'];

  function UserController($scope, $modal, bindTable, $log, AuthFactory, $stateParams) {
    var vm = this;
    vm.userId = $stateParams.userId;
    var imagesTable = bindTable('images');
    imagesTable.bind({ userId: vm.userId }, 100);

    vm.images = imagesTable.rows;
    vm.delete = imagesTable.delete;

    vm.likePin = function (imageId) {
      AuthFactory.getUserName()
        .then(function (user) {
          var imageIndex = _.findIndex(vm.images, {'id': imageId});
          if (!_.contains(vm.images[imageIndex].likes, user.userId)) {
            vm.images[imageIndex].likes.push(user.userId);
            imagesTable.update(vm.images[imageIndex]);
          }
      });
    };

    vm.addImage = function () {
      $modal.open({
        templateUrl: '/app/templates/add-image.html',
        controller: 'addImageFormController',
        size: 'sm'
      });
    };
  }
})();
