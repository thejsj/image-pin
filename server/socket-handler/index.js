/*jshint node:true */
'use strict';
var _ = require('lodash');
var r = require('../db');
var connectedUsers = {};
var handlers = require('./handler');
var socketHandler = function (io, socket) {
  // There should be way to automate the next 4 5 listeners automatically by
  // just having some code that generates the listeners by just having the
  // tableName and the joins

  // It would be better if you could only pass name and
  // the code would handle all other fields automatically
  socket.on('images:findById', handlers.findById('images', [
    {
      'fieldName': 'userId',
      'propertyName': 'user',
      'tableName': 'users'
    }
  ]));
  socket.on('images:add', handlers.add('images'));
  socket.on('images:update', handlers.update('images'));
  socket.on('images:delete', handlers.delete('images'));
  // Currently, images and user joins are coupled together.
  // This should work in a way similar to the `findById` method
  socket.on('images:changes:start', handlers.changeStart('images', socket));

  socket.on('User:connect', function () {
    var userId = '' + Date.now() + Math.floor(1000 * Math.random());
    if (connectedUsers[userId] === undefined) {
      connectedUsers[userId] = {
        'userId': userId,
        'socketId': socket.id
      };
      io.emit('User:update', userId);
      socket.emit('User:connect', userId);
    }
    r
      .table('photos')
      .run(r.conn)
      .then(function (cursor) {
       return cursor.toArray();
      })
      .then(function (photos) {
       photos.forEach(function (photo) {
          var copy = _.clone(photo);
          delete copy.file;
          var image_copy = {
            id: photo.id,
            file: photo.file
          };
          socket.emit('Photo:update', copy);
          socket.emit('Photo:update', image_copy);
       });
      });
  });

  socket.on('User:disconnect', function () {
    _.each(connectedUsers, function (user, key) {
      if (user.socketId === socket.id) delete connectedUsers[key];
    });
   });

   socket.on('Message:mirror', function (message) {
     socket.emit('Message:update', message);
   });
};

module.exports = socketHandler;
