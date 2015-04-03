/*global angular:true, moment:true, _:true */
(function () {
  'use strict';
  angular.module('imagePin.services')
    .factory('ImageFactory', ImageFactory);

  ImageFactory.$inject = ['$http', '$upload'];

  function ImageFactory($http, $upload) {

    var factory = {
      uploadImage: uploadImage,
      getAllImages: getAllImages
    };

    return factory;

    function uploadImage (userId, title, fileObj) {
      var file = fileObj[0];
      return $http.post('/api/image', {
        image: {
          type: file.type,
          title: title,
          userId: userId,
          size: file.size
        }
      })
      .then(function (res) {
        return $upload.upload({
          method: 'POST',
          url: '/api/image/' + res.data.id,
          file: file,
          data: {
            id: res.data.id
          }
        });
      })
      .catch(function (err) {
        console.log('Error Uploading File:', err);
      });
    }

    function getAllImages () {

    }

  }

})();
