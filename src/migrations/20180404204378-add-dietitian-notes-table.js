'use strict';

exports.up = function (db) {
  return db.createTable('dietitian_notes', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    dietitianId: {type: 'int', notNull: true},
    userId: {type: 'int', notNull: true},
    note: {type: 'text'},
    date: {type: 'datetime'},
    createdAt: {type: 'datetime default CURRENT_TIMESTAMP'},
    updatedAt: {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'}
  });
};

exports.down = function (db) {
  return db.dropTable('dietitian_notes', {ifExists: true});
};

