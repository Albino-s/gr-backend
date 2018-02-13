'use strict';

exports.up = function (db) {
  return db.changeColumn('users', 'createdAt', {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('users', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    });
};

exports.down = function (db) {
  return db.changeColumn('users', 'createdAt', {type: 'datetime'}).then(function () {
    return db.changeColumn('users', 'updatedAt', {type: 'datetime'});
  });
};
