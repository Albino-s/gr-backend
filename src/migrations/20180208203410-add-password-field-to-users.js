'use strict';

exports.up = function (db) {
  return db.addColumn('users', 'password', {type: 'string'});
};

exports.down = function (db) {
  return db.removeColumn('users', 'password');
};

