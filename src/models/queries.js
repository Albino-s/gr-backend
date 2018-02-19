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

// export const name = R.curry((httpQuery, query) => {
//   let {} = httpQuery;
//   if (!) {
//     throw invalidInputError;
//   }
//   search = search || '';
//   const rawQueryStr = `

//     `;
//   return query(builQueryObj(rawQueryStr));
// });
