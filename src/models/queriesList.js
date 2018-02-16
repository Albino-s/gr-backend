import R from 'ramda';
import {builQueryObj} from '../utils/query';
import {invalidInputError} from '../utils/errors';

export const getListIngredients = R.curry((httpQuery, query) => {
  let {search} = httpQuery;
  search = search || '';
  const rawQueryStr = `
    SELECT id, name_singular
    from ingredients
    WHERE name_singular LIKE '%${search}%' OR name_plural LIKE '%${search}%'
    ORDER BY name_singular ASC;`;
  return query(builQueryObj(rawQueryStr));
});

export const getListPantriesByIngredientIds = R.curry((httpQuery, query) => {
  let {ingredientIds, userId, nameStore} = httpQuery;
  if (!ingredientIds || !userId) {
    throw invalidInputError;
  }
  nameStore = nameStore || '';
  const rawQueryStr = `
    SELECT  pantries.id, pantries.productId, pantries.userId, pantries.is_deleted,
    pantries.quantity_us, pantries.unit_us, pantries.quantity_eu, pantries.unit_eu,
    pantries.createdAt, pantries.updatedAt, products.ingredientProduct as ingredientId from pantries
    JOIN products on products.id = pantries.productId
    WHERE pantries.productId IN (SELECT products.id from products
    WHERE products.ingredientProduct IN (${ingredientIds}) and products.store
    LIKE "%${nameStore}%") and pantries.userId = ${userId}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListPantriesByUserId = R.curry((httpQuery, query) => {
  let {userId} = httpQuery;
  if (!userId) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT pantries.*, products.ingredientProduct as ingredientId from pantries
    JOIN products on products.id = pantries.productId
    WHERE userId = ${userId} and quantity_us > 0`;
  return query(builQueryObj(rawQueryStr));
});

export const getListProductByWithoutIngredientIds = R.curry((httpQuery, query) => {
  let {ingredientIds, nameStore, search} = httpQuery;
  if (!ingredientIds) {
    throw invalidInputError;
  }
  nameStore = nameStore || '';
  search = search || '';
  const rawQueryStr = `
    SELECT products.id, products.name, products.price, products.store, products.size,
    products.unitProduct as unit_product, product_categories.name as category_name,
    ingredients.photo, ingredients.id as ingredientId, ingredients.name_singular as name_singular,
    usa_standart_units.name as unit_name from products
    JOIN ingredients
    on ingredients.id = products.ingredientProduct
    JOIN product_categories
    on ingredients.categoryIngredient = product_categories.id
    JOIN usa_standart_units
    on usa_standart_units.id = products.unitProduct
    WHERE ingredientProduct NOT IN (${ingredientIds})
    and products.store LIKE "%${nameStore}%"
    and ingredients.name_singular LIKE "%${search}%"
    GROUP BY products.ingredientProduct`;
  return query(builQueryObj(rawQueryStr));
});

export const getListProductsFromPantryByUserId = R.curry((httpQuery, query) => {
  let {userId} = httpQuery;
  if (!userId) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT pantries.*, products.*, ingredients.*, product_categories.name as category_name
    from pantries
    JOIN products on products.id = pantries.productId
    JOIN ingredients on ingredients.id = products.ingredientProduct
    JOIN product_categories on product_categories.id = ingredients.categoryIngredient
    WHERE pantries.userId = ${userId} and pantries.quantity_us > 0`;
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
