'use strict';
 /* eslint max-len: 0 */

const updateUsers = `UPDATE users SET avatar=(SELECT REPLACE(avatar,
"https://files.backand.io/nutritiousgrocer/", "https://s3.us-east-2.amazonaws.com/3peas/avatar/"))`;
const updateRecipes = `UPDATE recipes SET photo=(SELECT REPLACE(photo,
  "https://files.backand.io/nutritiousgrocer/", "https://s3.us-east-2.amazonaws.com/3peas/"))`;
const updateIngredients = `UPDATE ingredients SET photo=(SELECT REPLACE(photo,
  "https://files.backand.io/nutritiousgrocer/", "https://s3.us-east-2.amazonaws.com/3peas/"))`;

const updateUsersDown = `UPDATE users SET avatar=(SELECT REPLACE(avatar,
"https://s3.us-east-2.amazonaws.com/3peas/avatar/", "https://files.backand.io/nutritiousgrocer/"))`;
const updateRecipesDown = `UPDATE recipes SET photo=(SELECT REPLACE(photo,
  "https://s3.us-east-2.amazonaws.com/3peas/", "https://files.backand.io/nutritiousgrocer/"))`;
const updateIngredientsDown = `UPDATE ingredients SET photo=(SELECT REPLACE(photo,
  "https://s3.us-east-2.amazonaws.com/3peas/", "https://files.backand.io/nutritiousgrocer/"))`;

exports.up = function (db) {
  return db.runSql(updateUsers).then(function () {
    return db.runSql(updateRecipes).then(function () {
      return db.runSql(updateIngredients);
    });
  });
};

exports.down = function (db) {
  return db.runSql(updateUsersDown).then(function () {
    return db.runSql(updateRecipesDown).then(function () {
      return db.runSql(updateIngredientsDown);
    });
  });
};
