'use strict';

exports.up = function (db) {
  return db.changeColumn('tags', 'createdAt',
  {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('tags', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    })
      .then(function () {
        return db.changeColumn('tags', 'is_deleted',
          {type: 'boolean', defaultValue: 0});
      });
};

exports.down = function (db) {
  return db.changeColumn('tags', 'createdAt', {type: 'datetime'})
    .then(function () {
      return db.changeColumn('tags', 'updatedAt', {type: 'datetime'});
    })
    .then(function () {
      return db.changeColumn('tags', 'is_deleted', {type: 'BINARY'});
    });
};
