import R from 'ramda';
import {builQueryObj} from '../utils/query';
// import {invalidInputError} from '../utils/errors';

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
