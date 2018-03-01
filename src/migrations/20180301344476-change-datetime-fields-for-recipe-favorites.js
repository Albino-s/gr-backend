'use strict';

exports.up = function (db) {
  return db.changeColumn('recipe_favorites', 'createdAt',
  {type: 'datetime default CURRENT_TIMESTAMP'})
    .then(function () {
      return db.changeColumn('recipe_favorites', 'updatedAt',
        {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'});
    });
};

exports.down = function (db) {
  return db.changeColumn('recipe_favorites', 'createdAt', {type: 'datetime'}).then(function () {
    return db.changeColumn('recipe_favorites', 'updatedAt', {type: 'datetime'});
  });
};
