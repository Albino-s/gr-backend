'use strict';

exports.up = function (db) {
  return db.changeColumn('ingredients', 'createdAt',
  {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('ingredients', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    })
      .then(function () {
        return db.changeColumn('ingredients', 'is_deleted',
          {type: 'boolean', defaultValue: 0});
      });
};

exports.down = function (db) {
  return db.changeColumn('ingredients', 'createdAt', {type: 'datetime'})
    .then(function () {
      return db.changeColumn('ingredients', 'updatedAt', {type: 'datetime'});
    })
    .then(function () {
      return db.changeColumn('ingredients', 'is_deleted', {type: 'BINARY'});
    });
};
