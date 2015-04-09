/*global angular:true, Blob: true, FileReader: true, _:global */

(function () {
  'use strict';

  angular.module('imagePin.form', [])
    .controller('CommentFormController', CommentFormController);

  CommentFormController.$inject = ['$scope', '$modal', 'bindTable', '$log', 'AuthFactory'];

  function CommentFormController($scope, $modal, bindTable, $log, AuthFactory) {
    var vm = this;

    var commentsTable = bindTable('comments');
    commentsTable.bind({ }, 1000);

    vm.addComment = function (imageId) {
      AuthFactory.getUserName()
        .then(function (user) {
          commentsTable.add({
            text: $scope.textarea,
            userId: user.userId,
            imageId: imageId,
            createdAt: new Date()
          });
          $scope.textarea = '';
        });
    };

 }

}());
