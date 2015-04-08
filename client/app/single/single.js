/*global angular:true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.single', ['ui.bootstrap'])
    .controller('SingleController', SingleController);

  SingleController.$inject = ['$scope', 'bindTable',  'AuthFactory', '$stateParams'];

  function SingleController($scope, bindTable, AuthFactory, $stateParams) {
    var vm = this;
    vm.imageId = $stateParams.id;
    window.vm = vm;
    var commentsTable = bindTable('comments');
    commentsTable.bind({ imageId: vm.imageId  }, 100);

    var imagesTable = bindTable('images');
    imagesTable.bind({ id: vm.imageId  }, 1);

    vm.comments = commentsTable.rows;

    // Add Comment
    vm.addComment = function () {
        AuthFactory.getUserName()
          .then(function (user) {
            commentsTable.add({
              text: $scope.textarea,
              userId: user.userId,
              imageId: vm.imageId,
              createdAt: new Date()
            });
            $scope.textarea = '';
          });
    };

    // Like Pin
    vm.likePin = function () {
      console.log('likePin');
      AuthFactory.getUserName()
        .then(function (user) {
          if (!_.contains(vm.image.likes, user.userId)) {
            vm.image.likes.push(user.userId);
            imagesTable.update(vm.image);
          }
      });
    };

    // Listen to changes in the table
    AuthFactory.getUserName()
      .then(function (user) {
        $scope.$watchCollection(function () {
          return imagesTable.rows;
        }, function (newVal, oldVal) {
          if (imagesTable.rows.length <= 0) return;
          vm.image = imagesTable.rows[0];
          vm.image.likedByUser = _.contains(vm.image.likes, user.userId);
            if (vm.image.file !== undefined && vm.image.base64 === undefined) {
              (function (image) {
                var reader = new FileReader();
                reader.onload = function(e) {
                  var base64 = (e.target.result).match(/^data:([A-Za-z-+\/]*);base64,(.+)$/);
                  vm.image.base64  = base64[2];
                  $scope.$digest();
                }.bind(this);
                reader.readAsDataURL(new Blob([image.file]));
              }(vm.image));
            };
          });
      });

  };

}());
