'use strict';

exports.up = function (db) {
  return db.addColumn('custom_nutritions', 'breakfastGoal', {type: 'int'})
    .then(function () {
      return db.addColumn('custom_nutritions', 'lunchGoal', {type: 'int'});
    })
    .then(function () {
      return db.addColumn('custom_nutritions', 'dinnerGoal', {type: 'int'});
    })
    .then(function () {
      return db.addColumn('custom_nutritions', 'snacksGoal', {type: 'int'});
    })
    .then(function () {
      return db.addColumn('custom_nutritions', 'gender', {type: 'varchar(255)'});
    })
    .then(function () {
      return db.addColumn('custom_nutritions', 'height', {type: 'DECIMAL(50,2)'});
    })
    .then(function () {
      return db.addColumn('custom_nutritions', 'weight', {type: 'DECIMAL(50,2)'});
    });
};

exports.down = function (db) {
  return db.removeColumn('custom_nutritions', 'breakfastGoal')
  .then(function () {
    return db.removeColumn('custom_nutritions', 'lunchGoal');
  })
  .then(function () {
    return db.removeColumn('custom_nutritions', 'dinnerGoal');
  })
  .then(function () {
    return db.removeColumn('custom_nutritions', 'snacksGoal');
  })
  .then(function () {
    return db.removeColumn('custom_nutritions', 'gender');
  })
  .then(function () {
    return db.removeColumn('custom_nutritions', 'height');
  })
  .then(function () {
    return db.removeColumn('custom_nutritions', 'weight');
  });
};
