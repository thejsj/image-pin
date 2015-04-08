/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.home', ['ui.bootstrap'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$modal', 'bindTable', '$log', 'AuthFactory'];

  function HomeController($scope, $modal, bindTable, $log, AuthFactory) {
    var vm = this;
    var imagesTable = bindTable('images');
    imagesTable.bind(function (row) {
     return row.hasFields('file');
    }, 100);
    window.imagesTable = imagesTable;
    vm.images = imagesTable.rows;
    vm.delete = imagesTable.delete;

    $scope.$watchCollection(function () {
      return vm.images;
    }, function (newVal, oldVal) {
      changeImagesToBase64();
    });

    var changeImagesToBase64 = function () {
      vm.images.forEach(function (image, key) {
        if (image.file !== undefined && image.base64 === undefined) {
          (function (i) {
            var reader = new FileReader();
            reader.onload = function(e) {
              var base64 = (e.target.result).match(/^data:([A-Za-z-+\/]*);base64,(.+)$/);
              vm.images[i].base64 = base64[2];
              $scope.$digest();
            }.bind(this);
            reader.readAsDataURL(new Blob([image.file]));
          }(key));
        }
      });
    };

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
