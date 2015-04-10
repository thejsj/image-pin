/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.home', ['ui.bootstrap'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$modal', 'bindTable', 'AuthFactory', 'ImageFactory'];

  function HomeController($scope, $modal, bindTable, AuthFactory, ImageFactory) {
    var vm = this;

    vm.images = ImageFactory.getImages();

    var el = document.getElementById('image-drag-drop');

    el.addEventListener('drop', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var files = evt.dataTransfer.files;
      AuthFactory.getUserName()
        .then(function (user) {
          return ImageFactory.uploadImage(user.userId, '', files);
        });
    }, false);

    el.addEventListener('dragover', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    });

    vm.addImage = function () {
      $modal.open({
        templateUrl: '/app/templates/add-image.html',
        controller: 'addImageFormController',
        size: 'sm'
      });
    };

  }
})();
