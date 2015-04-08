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

  socket.on('comments:findById', handlers.findById('comments', [
    {
      'fieldName': 'userId',
      'propertyName': 'user',
      'tableName': 'users'
    }
  ]));
  socket.on('comments:add', handlers.add('comments'));
  socket.on('comments:update', handlers.update('comments'));
  socket.on('comments:delete', handlers.delete('comments'));
  socket.on('comments:changes:start', handlers.changeStart('comments', socket));

};

module.exports = socketHandler;
