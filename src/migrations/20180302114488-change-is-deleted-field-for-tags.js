'use strict';

exports.up = function (db) {
  return db.runSql(`UPDATE tags SET is_deleted = 0;`)
    .then(function () {
      return db.changeColumn('tags', 'is_deleted',
        {type: 'boolean', defaultValue: 0, notNull: true});
    });
};

exports.down = function (db) {
  return db.changeColumn('tags', 'is_deleted', {type: 'boolean', defaultValue: 0});
};
