import R from 'ramda';
import {builQueryObj} from '../utils/query';
import {invalidInputError} from '../utils/errors';

export const getRecipeIngredientsByIngredientIds = R.curry((httpQuery, query) => {
  let {ingredientIds} = httpQuery;
  if (!ingredientIds) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT recipe_ingredients.recipeId, recipes.ingredient_count,
    count(recipe_ingredients.recipeId) as countIngredientPantry from recipe_ingredients
    JOIN recipes on recipes.id = recipe_ingredients.recipeId
    WHERE recipe_ingredients.ingredientId IN (${ingredientIds})
    Group By recipeId`;
  return query(builQueryObj(rawQueryStr));
});

export const getRecipesByFilters = R.curry((httpQuery, query) => {
  let {tagIds, countTags, withIngredientIds, countWithIngredients, pageNumber, pageSize, search,
    time, withoutIngredientIds} = httpQuery;
  if (!tagIds || !countTags || !withIngredientIds || !countWithIngredients || !pageNumber ||
     !pageSize || !time || !withoutIngredientIds) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT *,
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipeId
    Where recipes.id IN(SELECT recipes.id from recipes
    JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    Where recipe_tags.tagId IN(${tagIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%' OR
    recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    and recipes.id NOT IN(Select recipe_ingredients.recipeId from recipe_ingredients
    WHERE recipe_ingredients.ingredientId IN(${withoutIngredientIds}))
    GROUP BY recipes.id
    HAVING COUNT(recipe_tags.tagId) = ${countTags})
    and  recipe_ingredients.ingredientId IN(${withIngredientIds})
    GROUP BY recipes.id, recipe_ingredients.id
    HAVING COUNT(recipe_ingredients.ingredientId) = ${countWithIngredients}
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
}); // original --- GROUP BY recipes.id

export const getRecipesByFiltersExcludeIngredients = R.curry((httpQuery, query) => {
  let {tagIds, countTags, pageNumber, pageSize, search, time, withoutIngredientIds} = httpQuery;
  if (!tagIds || !countTags || !pageNumber || !pageSize || !time || !withoutIngredientIds) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT *,
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    Where recipe_tags.tagId IN(${tagIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
    OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    and recipes.id NOT IN(Select recipe_ingredients.recipeId from recipe_ingredients
    WHERE recipe_ingredients.ingredientId IN(${withoutIngredientIds}))
    GROUP BY recipes.id, recipe_tags.id
    HAVING COUNT(recipe_tags.tagId) = ${countTags}
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
}); // original --- GROUP BY recipes.id

export const getRecipesByFiltersIncludeIngredients = R.curry((httpQuery, query) => {
  let {tagIds, countTags, withIngredientIds, countWithIngredients, pageNumber, pageSize, search,
    time} = httpQuery;
  if (!tagIds || !countTags || !withIngredientIds || !countWithIngredients || !pageNumber ||
   !pageSize || !time) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT *,
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipeId
    Where recipes.id IN(SELECT recipes.id from recipes
    JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    Where recipe_tags.tagId IN(${tagIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
    OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    GROUP BY recipes.id HAVING COUNT(recipe_tags.tagId) = ${countTags})
    and  recipe_ingredients.ingredientId IN(${withIngredientIds})
    GROUP BY recipes.id, recipe_ingredients.id
    HAVING COUNT(recipe_ingredients.ingredientId) = ${countWithIngredients}
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
}); // original --- GROUP BY recipes.id

export const getRecipesByIngredients = R.curry((httpQuery, query) => {
  let {withIngredientIds, countWithIngredients, pageNumber, pageSize, search, time,
    withoutIngredientIds} = httpQuery;
  if (!withIngredientIds || !countWithIngredients || !pageNumber || !pageSize || !time ||
    !withoutIngredientIds) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT *,
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipeId
    WHERE recipe_ingredients.ingredientId IN(${withIngredientIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
     OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    and recipes.id NOT IN(Select recipe_ingredients.recipeId from recipe_ingredients
    WHERE recipe_ingredients.ingredientId IN(${withoutIngredientIds}))
    GROUP BY recipes.id, recipe_ingredients.id
    HAVING COUNT(recipe_ingredients.ingredientId) = ${countWithIngredients}
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
}); // original --- GROUP BY recipes.id

export const getRecipesByTags = R.curry((httpQuery, query) => {
  let {tagIds, countTags, pageNumber, pageSize, search, time} = httpQuery;
  if (!tagIds || !countTags || !pageNumber || !pageSize || !time) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT *, (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    Where recipe_tags.tagId IN(${tagIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
    OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    GROUP BY recipes.id, recipe_tags.id
    HAVING COUNT(recipe_tags.tagId) = ${countTags}
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
}); // original --- GROUP BY recipes.id

export const getRecipesByTime = R.curry((httpQuery, query) => {
  let {time, search, pageNumber, pageSize} = httpQuery;
  if (!time || !pageNumber || !pageSize) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT *, (recipes.prep_time + recipes.cook_time) as total_time from recipes
    WHERE (recipes.prep_time + recipes.cook_time) <= ${time}
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
    OR recipes.description LIKE '%${search}%')
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
