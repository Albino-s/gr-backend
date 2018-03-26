'use strict';

exports.up = function (db) {
  return db.addColumn('users', 'is_dietitian', {type: 'boolean', defaultValue: 0});
};

exports.down = function (db) {
  return db.removeColumn('users', 'is_dietitian');
};

