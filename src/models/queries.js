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
