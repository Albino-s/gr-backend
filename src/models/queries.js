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
