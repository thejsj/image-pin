/*jshint node:true */
'use strict';
var _ = require('lodash');
var r = require('./db');
var imageToAscii = require('image-to-ascii');
var connectedUsers = {};

var socketHandler = function (io, socket) {

  socket.on('images:findById', function(id, cb){
    r.table('images')
      .get(id)
      .run(r.conn, cb);
  });

  socket.on('images:add', function(record, cb){
    record = _.pick(record, 'name', 'images');
    record.createdAt = new Date();
    r.table('images')
      .insert(record)
      .run(r.conn, function(err, result){
        if(err) return cb(err);
        record.id = result.generated_keys[0];
        cb(null, record);
      });
  });

  socket.on('images:update', function(record, cb){
    record = _.pick(record, 'id', 'name', 'images');
    r.table('images')
      .get(record.id)
      .update(record)
      .run(r.conn, cb);
  });

  socket.on('images:delete', function(id, cb){
    r.table('images')
      .get(id)
      .delete()
      .run(r.conn, cb);
  });

  socket.on('images:changes:start', function(data){
    var limit, filter;
    limit = data.limit || 100;
    filter = data.filter || {};

    r.getNewConnection()
      .then(function (conn) {
        r.table('images')
          .orderBy({index: r.desc('createdAt')})
          .filter(filter)
          .limit(limit)
          .changes()
          .run(r.conn, handleChange);
      });

    function handleChange (err, cursor) {
      if(err) return console.log(err);
      if(cursor) {
        cursor.each(function(err, record){
          if(err) return console.log(err);
          socket.emit('images:changes', record);
        });
      }
      socket.on('images:changes:stop', stopCursor);
      socket.on('disconnect', stopCursor);

      function stopCursor () {
        if(cursor) cursor.close();
        socket.removeListener('images:changes:stop', stopCursor);
        socket.removeListener('disconnect', stopCursor);
      }
    }
  });

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


  r.getNewConnection()
   .then(function (conn) {
     r.table('images')
      .changes()
      .run(conn)
      .then(function (cursor) {
        cursor.each(function (err, result) {
          if (result.new_val === null) {
            io.emit('Photo:delete', result.old_val.id);
          } else {
            // Send the metadata first, and then the base64 encoded image
            var main = result.new_val;
            var copy = _.clone(result.new_val);
            delete copy.file;
            var image_copy = {
              id: main.id,
              file: main.file
            };
            console.log(typeof image_copy.file);
            imageToAscii({
              path: main.path,
              size: {
                width: '200px',
                height: '10%'
              }
            }, function(err, converted) {
              console.log('Broadcasting Image:', new Date().toString());
              console.log(err || converted);
            });
            io.emit('Photo:update', copy);
            io.emit('Photo:update', image_copy);
          }
        });
      });
   });

};

module.exports = socketHandler;
