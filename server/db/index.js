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
        return r.tableList().run(r.conn)
          .then(function (tableList) {
            return q()
              .then(function() {
                if (tableList.indexOf('images') === -1) {
                  return r.tableCreate('images').run(r.conn);
                }
              })
              .then(function () {
                return r.table('images').indexList().run(r.conn);
              })
              .then(function (indexList) {
                if (indexList.indexOf('createdAt')) {
                  return r.table('images').indexCreate('createdAt').run(r.conn);
                }
                return true;
              })
              .then(function () {
                if (tableList.indexOf('users') === -1) {
                  return r.tableCreate('users').run(r.conn);
                }
              })
              .then(function () {
                return r.table('users').indexList().run(r.conn)
                  .then(function (indexList) {
                    if (indexList.indexOf('login') === -1) {
                      return r.table('users').indexCreate('login').run(r.conn);
                    }
                  });
              });
          });
      });
  });

module.exports = r;
