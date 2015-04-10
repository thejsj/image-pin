/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';

  angular.module('imagePin.form', [])
    .controller('CommentFormController', CommentFormController);

  CommentFormController.$inject = ['$scope', '$modal', 'AuthFactory', 'ImageFactory'];

  function CommentFormController($scope, $modal, AuthFactory, ImageFactory) {
    var vm = this;

    vm.addComment = function (imageId) {
      ImageFactory.addComment(imageId, $scope.textarea)
        .then(function () {
          $scope.textarea = '';
        });
    };

 }

}());
