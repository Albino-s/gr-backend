'use strict';

exports.up = function (db) {
  return db.changeColumn('eu_standart_units', 'createdAt',
  {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('eu_standart_units', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    });
};

exports.down = function (db) {
  return db.changeColumn('eu_standart_units', 'createdAt', {type: 'datetime'}).then(function () {
    return db.changeColumn('eu_standart_units', 'updatedAt', {type: 'datetime'});
  });
};
