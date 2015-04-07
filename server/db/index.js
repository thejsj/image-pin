/*jshint node:true */
'use strict';

var q = require('q');
var r = require('rethinkdb');
var config = require('config');

r.connections = [];
r.getNewConnection = function () {
  return r.connect(config.get('rethinkdb'))
    .then(function (conn) {
      conn.use(config.get('rethinkdb').db);
      r.connections.push(conn);
      return conn;
    });
};

var createIfDoesntExist = function (query) {
  return query
    .run(r.conn)
    .catch(function () {});
};

r.connect(config.get('rethinkdb'))
  .then(function (conn) {
    r.conn = conn;
    r.connections.push(conn);
    return r.dbCreate(config.get('rethinkdb').db).run(r.conn)
      .then(function () {})
      .catch(function () {})
      .then(function () {
        r.conn.use(config.get('rethinkdb').db);
        // Create Tables
        q()
          .then(function () {
            return r.tableCreate('images').then(createIfDoesntExist);
          })
          .then(function () {
            return r.table('images').indexCreate('createdAt').then(createIfDoesntExist);
          })
          .then(function () {
            return r.tableCreate('users').then(createIfDoesntExist);
          })
          .then(function () {
            return r.table('users').indexCreate('login').then(createIfDoesntExist);
          })
          .then(function () {
            return r.tableCreate('likes').then(createIfDoesntExist);
          });
      });
  });

module.exports = r;
