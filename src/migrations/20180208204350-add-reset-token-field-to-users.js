'use strict';

exports.up = function (db) {
  return db.addColumn('users', 'resetToken', {type: 'string'});
};

exports.down = function (db) {
  return db.removeColumn('users', 'resetToken');
};

