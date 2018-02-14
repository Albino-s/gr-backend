'use strict';

exports.up = function (db) {
  return db.changeColumn('pantry_transactions', 'createdAt',
  {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('pantry_transactions', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    })
      .then(function () {
        return db.changeColumn('pantry_transactions', 'is_deleted',
          {type: 'boolean', defaultValue: 0});
      });
};

exports.down = function (db) {
  return db.changeColumn('pantry_transactions', 'createdAt', {type: 'datetime'})
    .then(function () {
      return db.changeColumn('pantry_transactions', 'updatedAt', {type: 'datetime'});
    })
    .then(function () {
      return db.changeColumn('pantry_transactions', 'is_deleted', {type: 'BINARY'});
    });
};
