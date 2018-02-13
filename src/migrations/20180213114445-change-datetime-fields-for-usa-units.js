'use strict';

exports.up = function (db) {
  return db.changeColumn('usa_standart_units', 'createdAt',
  {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('usa_standart_units', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    })
      .then(function () {
        return db.changeColumn('usa_standart_units', 'is_main',
          {type: 'boolean', defaultValue: 0});
      });
};

exports.down = function (db) {
  return db.changeColumn('usa_standart_units', 'createdAt', {type: 'datetime'})
    .then(function () {
      return db.changeColumn('usa_standart_units', 'updatedAt', {type: 'datetime'});
    })
    .then(function () {
      return db.changeColumn('usa_standart_units', 'is_main', {type: 'BINARY'});
    });
};
