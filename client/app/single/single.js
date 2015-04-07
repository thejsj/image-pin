/*global angular:true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.single', ['ui.bootstrap'])
    .controller('SingleController', SingleController);

  SingleController.$inject = ['$scope', 'bindTable',  'AuthFactory', '$stateParams'];

  function SingleController($scope, bindTable, AuthFactory, $stateParams) {
    var vm = this;
    var imagesTable = bindTable('images');
    imagesTable.bind(null, 100);

    imagesTable.findById($stateParams.id)
      .then(function (image) {
        return AuthFactory.getUserName()
          .then(function (user) {
            vm.image = image;
            vm.image.likedByUser = _.contains(vm.image.likes, user.userId);
            if (vm.image.base64 === undefined) {
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
