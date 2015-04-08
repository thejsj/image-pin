/*global angular:true, moment:true, _:true */
(function () {
  'use strict';
  angular.module('imagePin.services')
    .factory('CommentFactory', CommentFactory);

  CommentFactory.$inject = ['$http', 'bindTable'];

  function CommentFactory($http, bindTable) {

    var factory = {
      addComment: addComment,
    };

    return factory;

    function addComment (userId, imageId, text) {

    };

  }

})();
