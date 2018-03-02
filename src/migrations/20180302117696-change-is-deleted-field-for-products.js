'use strict';

exports.up = function (db) {
  return db.runSql(`UPDATE products SET is_deleted = 0 where is_deleted is NULL;`)
    .then(function () {
      return db.changeColumn('products', 'is_deleted',
        {type: 'boolean', defaultValue: 0, notNull: true});
    })
    .then(function () {
      return db.runSql(`UPDATE products SET is_organic = 0 where is_organic is NULL;`);
    })
    .then(function () {
      return db.changeColumn('products', 'is_organic',
        {type: 'boolean', defaultValue: 0, notNull: true});
    });
};

exports.down = function (db) {
  return db.changeColumn('products', 'is_deleted', {type: 'boolean', defaultValue: 0})
    .then(function () {
      return db.changeColumn('products', 'is_organic', {type: 'boolean', defaultValue: 0});
    });
};
