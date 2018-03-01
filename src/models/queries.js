import R from 'ramda';
import {builQueryObj} from '../utils/query';
import {invalidInputError} from '../utils/errors';

export const getIngredientIdsWithProduct = R.curry((httpQuery, query) => {
  let {ingredientIds, nameStore} = httpQuery;
  if (!ingredientIds) {
    throw invalidInputError;
  }
  nameStore = nameStore || '';
  const rawQueryStr = `
    SELECT products.ingredientProduct from products
    WHERE products.ingredientProduct IN (${ingredientIds})
    and products.store LIKE "%${nameStore}%"
    GROUP BY products.ingredientProduct`;
  return query(builQueryObj(rawQueryStr));
});

export const getMinMaxCookTimes = R.curry((httpQuery, query) => {
  const rawQueryStr = `
    SELECT
    MAX(prep_time + cook_time) as max_time,
    MIN(prep_time + cook_time) as min_time from recipes;`;
  return query(builQueryObj(rawQueryStr));
});

export const getProductFromPantryById = R.curry((httpQuery, query) => {
  const {pantryId} = httpQuery;
  if (!pantryId) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT pantries.*, products.*, ingredients.*, product_categories.name as category_name
    from pantries
    JOIN products on products.id = pantries.productId
    JOIN ingredients on ingredients.id = products.ingredientProduct
    JOIN product_categories on product_categories.id = ingredients.categoryIngredient
    WHERE pantries.quantity_us > 0 and pantries.id = ${pantryId}`;
  return query(builQueryObj(rawQueryStr));
});

export const getProductsByIngredientIds = R.curry((httpQuery, query) => {
  let {ingredientIds, nameStore} = httpQuery;
  if (!ingredientIds) {
    throw invalidInputError;
  }
  nameStore = nameStore || '';
  const rawQueryStr = `
    SELECT products.id, products.name, products.price, products.store, products.size,
    products.unitProduct as unit_product, product_categories.name as category_name,
    ingredients.photo, ingredients.id as ingredientId, usa_standart_units.name as unit_name
    from products
    JOIN ingredients
    on ingredients.id = products.ingredientProduct
    JOIN product_categories on ingredients.categoryIngredient = product_categories.id
    JOIN usa_standart_units on usa_standart_units.id = products.unitProduct
    WHERE ingredientProduct IN (${ingredientIds})
    and  products.store  LIKE "%${nameStore}%"
    GROUP BY products.ingredientProduct, products.id`;
  return query(builQueryObj(rawQueryStr));
});

export const getQuickAndEasyRecipes = R.curry((httpQuery, query) => {
  let {pageSize, pageNumber} = httpQuery;
  if (!pageSize || !pageNumber) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT *,
    (select count(id) from recipes) as total_count,
    (prep_time + cook_time) as total_time from recipes
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

export const getUnitIngredientFromRecipe = R.curry((httpQuery, query) => {
  let {ingredientId, unit_us} = httpQuery;
  if (!ingredientId || !unit_us) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT recipe_ingredients.quantity_eu, recipe_ingredients.unit_eu,
    recipe_ingredients.quantity_us from ingredients
    JOIN recipe_ingredients on recipe_ingredients.ingredientId = ingredients.id
    WHERE ingredients.id = ${ingredientId} and recipe_ingredients.unit_us = ${unit_us}
    Limit 1`;
  return query(builQueryObj(rawQueryStr));
});

export const searchRecipesByTotalTime = R.curry((httpQuery, query) => {
  let {search, pageNumber, pageSize} = httpQuery;
  if (!pageNumber || !pageSize) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT *, (select count(id) from recipes WHERE name  LIKE '%${search}%' OR instructions
    LIKE '%${search}%' OR description LIKE '%${search}%') as total_count,
    (prep_time + cook_time) as total_time from recipes
    WHERE name  LIKE '%${search}%' OR instructions LIKE '%${search}%'
    OR description LIKE '%${search}%'
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

export const removeRecipeTags = R.curry((httpQuery, query) => {
  let {recipeId, tagIds} = httpQuery;
  if (!recipeId || !tagIds) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    Delete from recipe_tags
    where recipeId = ${recipeId} and tagId IN (${tagIds})`;
  return query(builQueryObj(rawQueryStr));
});

export const getQuickAndEasyRecipesWithoutFavorite = R.curry((httpQuery, query) => {
  let {pageSize, pageNumber, favoriteRecipes} = httpQuery;
  if (!pageSize || !pageNumber || !favoriteRecipes) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT *,
    (select count(id) from recipes Where id NOT IN (${favoriteRecipes}) ) as total_count,
    (prep_time + cook_time) as total_time from recipes
    Where id NOT IN (${favoriteRecipes})
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

// ================= unused queries ==============//
// getListCategories
// SELECT * from product_categories
// ----------------------------------------]\
// getListIngredientsWithSearchForWebAdmin
// search, pageNumber, pageSize
// SELECT ingredients.*, product_categories.name as category_name, usa_standart_units.full_name as
// unit_name,
// (Select COUNT(1) as totalRows from ingredients
//     Where (ingredients.name_singular  LIKE '%{{search}}%' OR ingredients.name_plural
// LIKE '%{{search}}%') ) as totalRows from ingredients
// Join product_categories on product_categories.id = ingredients.categoryIngredient
// Join usa_standart_units on usa_standart_units.id = ingredients.unitIngredient
// Where (ingredients.name_singular  LIKE '%{{search}}%' OR ingredients.name_plural
// LIKE '%{{search}}%')
// ORDER BY ingredients.name_singular ASC
// LIMIT {{pageNumber}}, {{pageSize}}
// ----------------------------------------
// getListProducts
// search
// SELECT *
// from products
// WHERE name LIKE '%{{search}}%'
// ORDER BY name ASC;
// ----------------------------------------------------
// getListProductsWithSearchForWebAdmin
// search, pageNumber, pageSize
// SELECT products.*, usa_standart_units.full_name as unit_name,
// (Select COUNT(1) as totalRows from products
//     Where (products.name  LIKE '%{{search}}%')) as totalRows
// from products
// Join usa_standart_units on usa_standart_units.id = products.unitProduct
// Where (products.name  LIKE '%{{search}}%')
// ORDER BY products.name ASC
// LIMIT {{pageNumber}}, {{pageSize}}
// -------------------------------------------------------
// getListRecipeFavoriteIds
// userId
// SELECT recipeId from recipe_favorites
// where userId = {{userId}}
// ------------------------------------------------------------
// getListRecipeFavorites
// userId, pageNumber, pageSize
// SELECT recipes.*,
// (recipes.prep_time + recipes.cook_time) as total_time from recipes

// JOIN recipe_favorites ON recipes.id = recipe_favorites.recipeId
// where recipe_favorites.userId = {{userId}}

/* WHERE recipe_ingredients.ingredientId IN({{withIngredientIds}})
and (recipes.name  LIKE '%{{search}}%' OR recipes.instructions LIKE '%{{search}}%'
OR recipes.description LIKE '%{{search}}%')
and (recipes.prep_time + recipes.cook_time) <= {{time}}
GROUP BY recipes.id
HAVING COUNT(recipe_ingredients.ingredientId) = {{countWithIngredients}} */

// ORDER BY total_time ASC
// LIMIT {{pageNumber}}, {{pageSize}}
// ---------------------------------------------------------------
// getNutrition
// userId, intervalStart, intervalEnd
// SELECT sum(recipe_nutritions.calcium) as calcium,
//  sum(recipe_nutritions.calories) as calories,
//  sum(recipe_nutritions.calories_from_fat) as calories_from_fat,
//  sum(recipe_nutritions.total_fat) as total_fat,
//  sum(recipe_nutritions.saturated_fat) as saturated_fat,
//  sum(recipe_nutritions.trans_fat) as trans_fat,
//  sum(recipe_nutritions.cholesterol) as cholesterol,
//  sum(recipe_nutritions.sodium) as sodium,
//  sum(recipe_nutritions.potassium) as potassium,
//  sum(recipe_nutritions.total_carbohydrates) as total_carbohydrates,
//  sum(recipe_nutritions.dietary_fiber) as dietary_fiber,
//  sum(recipe_nutritions.sugar) as sugar,
//  sum(recipe_nutritions.protein) as protein,
//  sum(recipe_nutritions.vitamin_a) as vitamin_a,
//  sum(recipe_nutritions.vitamin_c) as vitamin_c,
//  sum(recipe_nutritions.iron) as iron,
//  sum(recipe_nutritions.servings) as servings from recipe_histories
// JOIN recipe_nutritions on recipe_nutritions.recipeId = recipe_histories.recipeId
// WHERE userId = {{userId}}
//         and recipe_servings <> 0
//         and recipe_histories.createdAt > '{{intervalStart}}'
//         and recipe_histories.createdAt < '{{intervalEnd}}'
// ------------------------------------------------------------------------
// removeRecipeFavorite
// recipeId, userId
// Delete from recipe_favorites
// Where userId = {{userId}} AND recipeId = {{recipeId}}
// --------------------------------------------------------------------
