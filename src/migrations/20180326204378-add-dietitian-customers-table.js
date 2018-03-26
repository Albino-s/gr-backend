'use strict';

var boolean = {
  type: 'boolean',
  defaultValue: 0,
  notNull: true
};

exports.up = function (db) {
  return db.createTable('dietitian_customers', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    dietitianId: {type: 'int', notNull: true},
    userId: {type: 'int', notNull: true},
    is_confirmed: boolean,
    createdAt: {type: 'datetime default CURRENT_TIMESTAMP'},
    updatedAt: {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'}
  });
};

exports.down = function (db) {
  return db.dropTable('dietitian_customers', {ifExists: true});
};

