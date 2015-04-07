/*global angular:true, _:global */

(function () {
  'use strict';
  angular.module('imagePin.single', ['ui.bootstrap'])
    .controller('SingleController', SingleController);

  SingleController.$inject = ['$scope', 'bindTable',  'AuthFactory', '$stateParams'];

  console.log('Start Single Controller');
  function SingleController($scope, bindTable, AuthFactory, $stateParams) {
    var vm = this;
    var imagesTable = bindTable('images');
    imagesTable.bind(null, 100);

    imagesTable.findById($stateParams.id)
      .then(function (image) {
          vm.image = image;
         if (vm.image.base64 === undefined) {
              (function (image) {
                var reader = new FileReader();
                reader.onload = function(e) {
                  var base64 = (e.target.result).match(/^data:([A-Za-z-+\/]*);base64,(.+)$/);
                  vm.image.base64  = base64[2];
                  console.log(vm.image);
                  $scope.$digest();
                }.bind(this);
                reader.readAsDataURL(new Blob([image.file]));
              }(vm.image));
            }
      });
  };

}());
