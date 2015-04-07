var r = require('../db');
var _ = require('lodash');

var findById = function(tableName, joins) {
  return function(id, cb){
    console.log('* findById', id);
    // Establish basic query
    var query = r.table(tableName).get(id);
    // Add joins
    joins.forEach(function (join) {
      // Build Query
      query = query
        .merge(function(row){
          // Build object
          // I tried to dynamically create a query based on the fieldName, but it didn't work
          return { user: r.table(join.tableName).get(row('userId')) };
        });
    });
    console.log(query.toString());
    // Run Query
    query.run(r.conn, cb);
  };
};
var add = function (tableName) {
  return function(record, cb){
    console.log('* Add');
    record.createdAt = new Date();
    console.log('Record: ', record);
    r.table(tableName)
      .insert(record)
      .run(r.conn, function(err, result){
        if(err) return cb(err);
        record.id = result.generated_keys[0];
        cb(null, record);
      });
  };
};

var update = function (tableName) {
  return function(record, cb){
    // Only pick certain fields
    record = _.pick(record, 'id', 'title', 'likes');
    record.likes = _.unique(record.likes);
    console.log('* Update', record);
    r.table(tableName)
      .get(record.id)
      .update(record)
      .run(r.conn, cb);
  };
};

var _delete = function (tableName) {
  return function(id, cb){
    console.log('* Delete');
    r.table(tableName)
      .get(id)
      .delete()
      .run(r.conn, cb);
  };
};

var changeStart = function (tableName, socket) {
  return function(data){
    console.log('* Change Start');
    var limit, filter;
    limit = data.limit || 100;
    filter = data.filter || {};

    r.getNewConnection()
      .then(function (conn) {
        r.table(tableName)
          .orderBy({index: r.desc('createdAt')})
          .filter(filter)
          .limit(limit)
          .changes()
          .merge(function(row){
            // This should be integrated with the joins table above!
            return { new_val: {
              user: r.table('users').get(row('new_val')('userId')) }
            };
          })
          .run(r.conn, handleChange);
      });

    function handleChange (err, cursor) {
      if(err) return console.log(err);
      if(cursor) {
        cursor.each(function(err, record){
          if(err) return console.log(err);
          socket.emit(tableName + ':changes', record);
        });
      }
      socket.on(tableName + ':changes:stop', stopCursor);
      socket.on('disconnect', stopCursor);

      function stopCursor () {
        if(cursor) cursor.close();
        socket.removeListener(tableName + ':changes:stop', stopCursor);
        socket.removeListener('disconnect', stopCursor);
      }
    }
  }
};


exports.findById = findById;
exports.add = add;
exports.update = update;
exports.delete = _delete;
exports.changeStart = changeStart;
