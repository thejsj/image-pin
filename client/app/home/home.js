/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.home', ['ui.bootstrap'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$modal', 'bindTable', '$log', 'AuthFactory'];

  function HomeController($scope, $modal, bindTable, $log, AuthFactory) {
    var vm = this;
    var imagesTable = bindTable('images');

    imagesTable.bind(function (row) { return row.hasFields('fileName'); }, 100);

    vm.images = imagesTable.rows;
    vm.delete = imagesTable.delete;

    window.imagesTable = imagesTable;

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
