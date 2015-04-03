/*global angular:true, Blob: true, FileReader: true */

(function () {
  'use strict';
  angular.module('imagePin.home', ['ui.bootstrap'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$modal', 'bindTable', '$log'];

  function HomeController($scope, $modal, bindTable, $log) {
    var vm = this;
    var imagesTable = bindTable('images');
    imagesTable.bind(null, 100);

    vm.images = imagesTable.rows;
    vm.delete = imagesTable.delete;

    $scope.$watchCollection(function () {
      return vm.images;
    }, function (newVal, oldVal) {
      changeImagesToBase64();
    });

    var changeImagesToBase64 = function () {
      vm.images.forEach(function (image, key) {
        if (image.base64 === undefined) {
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

    vm.addImage = function () {
      $modal.open({
        templateUrl: '/app/templates/add-image.html',
        controller: 'addImageFormController',
        size: 'sm'
      });
    };
  }
})();
