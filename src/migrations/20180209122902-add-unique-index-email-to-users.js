'use strict';

exports.up = function (db) {
  return db.runSql(`ALTER TABLE users add unique index email
    (email(255));`);
};

exports.down = function (db) {
  return db.runSql(`ALTER TABLE users DROP INDEX email;`);
};

