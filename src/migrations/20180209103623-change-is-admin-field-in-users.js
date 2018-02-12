'use strict';

exports.up = function (db) {
  return db.changeColumn('users', 'is_admin', {type: 'boolean', defaultValue: 0});
};

exports.down = function (db) {
  return db.changeColumn('users', 'is_admin', {type: 'BINARY'});
};

