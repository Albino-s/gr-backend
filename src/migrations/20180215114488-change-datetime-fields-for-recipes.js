'use strict';

exports.up = function (db) {
  return db.changeColumn('recipes', 'createdAt',
  {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('recipes', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    })
    .then(function () {
      return db.runSql(`UPDATE recipes SET is_deleted = 0;`);
    })
    .then(function () {
      return db.changeColumn('recipes', 'is_deleted',
        {type: 'boolean', defaultValue: 0, notNull: true});
    })
    .then(function () {
      return db.runSql(`UPDATE recipes SET is_hidden = 0;`);
    })
    .then(function () {
      return db.changeColumn('recipes', 'is_hidden',
        {type: 'boolean', defaultValue: 0, notNull: true});
    });
};

exports.down = function (db) {
  return db.changeColumn('recipes', 'createdAt', {type: 'datetime'})
    .then(function () {
      return db.changeColumn('recipes', 'updatedAt', {type: 'datetime'});
    })
    .then(function () {
      return db.changeColumn('recipes', 'is_deleted', {type: 'BINARY'});
    })
    .then(function () {
      return db.changeColumn('recipes', 'is_hidden', {type: 'BINARY'});
    });
};
