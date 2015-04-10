/*global angular:true, moment:true, _:true */
(function () {
  'use strict';
  angular.module('imagePin.services')
    .factory('ImageFactory', ImageFactory);

  ImageFactory.$inject = ['$rootScope', '$http', '$upload', 'AuthFactory', 'bindTable'];

  function ImageFactory($rootScope, $http, $upload, AuthFactory, bindTable) {

    var imagesTable = bindTable('images');
    var commentsTable = bindTable('comments');

    imagesTable.bind(function (row) { return row.hasFields('fileName'); }, 100);
    commentsTable.bind({}, 1000);

    var getImage = function (imageId, cb) {
      var imageIndex = _.findIndex(imagesTable.rows, {'id': imageId});
      if (imageIndex !== -1)  return cb(imagesTable.rows[imageIndex]);
      return cb(false);
    };

    var factory = {
      uploadImage: uploadImage,
      getImages: getImages,
      updateTitle: updateTitle,
      deleteImage: deleteImage,
      likePin: likePin,
      addComment: addComment
    };

    var joinCommentsToImages = function () {
     console.log('joinCommentsToImages', imagesTable.rows.length, commentsTable.rows.length);
      imagesTable.rows.forEach(function (image) {
        delete image.comments;
      });
      commentsTable.rows.forEach(function (comment) {
        getImage(comment.imageId, function (image) {
          if (!image) return;
          image.comments = image.comments || [];
          image.comments.push(comment);
        });
      });
    };

    // Listen to image changes
    $rootScope.$watchCollection(function () {
      return imagesTable.rows;
    }, joinCommentsToImages);

   //  Listen to comment changes
    $rootScope.$watchCollection(function () {
      return commentsTable.rows;
    }, joinCommentsToImages);

    return factory;

    function uploadImage (userId, title, fileObj) {
      var file = fileObj[0];
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (evt) {
          var img = new Image();
          img.src = evt.target.result;
          var width = img.width;
          var height = img.height;
          resolve({
              width: width,
              height: height
          });
        };
        reader.readAsDataURL(new Blob([file]));
       })
       .catch(function (err) {
        console.error('Error Reading Image:', err);
       })
       .then(function (dimensions) {
         return $http.post('/api/image', {
          image: {
            type: file.type,
            title: title,
            userId: userId,
            size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            likes: []
          }
         });
       })
       .then(function (res) {
          return $upload.upload({
            method: 'POST',
            url: '/api/image/' + res.data.id,
            file: file,
            data: {
              id: res.data.id,
              name: file.name
            }
          });
        })
       .catch(function (err) {
         console.error('Error Uploading File:', err);
       });
    };

    function getImages () {
      return imagesTable.rows;
    }


    function likePin (imageId ) {
      AuthFactory.getUserName()
        .then(function (user) {
          getImage(imageId, function (image) {
            if (!image) return;
            if (_.contains(image.likes, user.userId)) return;
            image.likes.push(user.userId);
            imagesTable
              .update(image);
          });
        });

    }

    function updateTitle (imageId, title) {
      return AuthFactory.getUserName()
        .then(function (user) {
          getImage(imageId, function (image) {
            if (!image) return;
            image.title = title;
            imagesTable
              .update(image);
          });
          return true;
        });
    };

    function deleteImage (imageId) {
      // Delete comments related to image
      commentsTable.rows.forEach(function (row) {
        if (row.imageId === imageId) {
          commentsTable.delete(row);
        }
      });
      // Delete image
      imagesTable.delete({
        id: imageId
      });
    };

   function addComment (imageId, text) {
      return AuthFactory.getUserName()
        .then(function (user) {
          commentsTable.add({
            text: text,
            userId: user.userId,
            imageId: imageId,
            createdAt: new Date()
          });
          return true;
        });
   }

  }
})();
