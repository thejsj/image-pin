/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.home', ['ui.bootstrap'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$modal', 'bindTable', '$log', 'AuthFactory'];

  function HomeController($scope, $modal, bindTable, $log, AuthFactory) {
    var vm = this;
    var imagesTable = bindTable('images');
    var commentsTable = bindTable('comments');

    imagesTable.bind(function (row) { return row.hasFields('fileName'); }, 100);
    commentsTable.bind({}, 1000);

    vm.images = imagesTable.rows;
    vm.delete = imagesTable.delete;
    vm._showComments = {};

    window.imagesTable = imagesTable;
    window.commentsTable = commentsTable;
    window.vm = vm;

    var getImage = function (imageId, cb) {
      var imageIndex = _.findIndex(vm.images, {'id': imageId});
      if (imageIndex) {
        return cb(vm.images[imageIndex]);
      }
      return cb(false);
    };

    $scope.$watchCollection(function () {
      return commentsTable.rows;
    }, function () {
      vm.images.forEach(function (image) {
        delete image.comments;
      });
      commentsTable.rows.forEach(function (comment) {
        getImage(comment.imageId, function (image) {
          if (!image) return;
          image.comments = image.comments || [];
          image.comments.push(comment);
        });
      });
    });

    vm.likePin = function (imageId) {
      AuthFactory.getUserName()
        .then(function (user) {
            getImage(imageId, function (image) {
              image.likes.push(user.userId);
              delete image.comments;
              imagesTable.update(image);
            });
          });
    };

    vm.showComments = function (imageId) {
      vm._showComments[imageId] = ((vm._showComments[imageId] === undefined) ? true : !vm._showComments[imageId]);
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
