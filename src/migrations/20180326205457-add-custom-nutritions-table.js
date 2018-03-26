'use strict';

exports.up = function (db) {
  return db.createTable('custom_nutritions', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {type: 'int', notNull: true},
    calories: {type: 'DECIMAL(50,2)'},
    calories_from_fat: {type: 'DECIMAL(50,2)'},
    total_fat: {type: 'DECIMAL(50,2)'},
    saturated_fat: {type: 'DECIMAL(50,2)'},
    trans_fat: {type: 'DECIMAL(50,2)'},
    sodium: {type: 'DECIMAL(50,2)'},
    potassium: {type: 'DECIMAL(50,2)'},
    total_carbohydrates: {type: 'DECIMAL(50,2)'},
    dietary_fiber: {type: 'DECIMAL(50,2)'},
    sugar: {type: 'DECIMAL(50,2)'},
    protein: {type: 'DECIMAL(50,2)'},
    vitamin_a: {type: 'DECIMAL(50,2)'},
    vitamin_c: {type: 'DECIMAL(50,2)'},
    calcium: {type: 'DECIMAL(50,2)'},
    iron: {type: 'DECIMAL(50,2)'},
    cholesterol: {type: 'DECIMAL(50,2)'},
    createdAt: {type: 'datetime default CURRENT_TIMESTAMP'},
    updatedAt: {type: 'datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'}
  });
};

exports.down = function (db) {
  return db.dropTable('custom_nutritions', {ifExists: true});
};

