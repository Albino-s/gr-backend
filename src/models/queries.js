import R from 'ramda';
import {builQueryObj} from '../utils/query';
import {invalidInputError} from '../utils/errors';

export const getCategoryIdsByUserPantry = R.curry((httpQuery, query) => {
  const {userId} = httpQuery;
  if (!userId || !R.test(/^(\-|\+)?([0-9]+|Infinity)$/, userId)) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT ingredients.categoryIngredient as categoryId from pantries
    JOIN products on products.id = pantries.productId
    JOIN ingredients on ingredients.id = products.ingredientProduct
    WHERE pantries.userId = ${userId} and pantries.quantity_us > 0
    Group by ingredients.categoryIngredient`;
  return query(builQueryObj(rawQueryStr));
});

export const getCountRecipesByFilters = R.curry((httpQuery, query) => {
  let {tagIds, countTags, withIngredientIds, countWithIngredients, search,
    time, withoutIngredientIds} = httpQuery;
  if (!tagIds || !countTags || !withIngredientIds || !countWithIngredients ||
  !withoutIngredientIds) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    Select count(1) as totalRecipes from
      (SELECT
      (recipes.prep_time + recipes.cook_time) as total_time from recipes
      JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipeId
      Where recipes.id IN(SELECT recipes.id from recipes
      JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
      Where recipe_tags.tagId IN(${tagIds})
      and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
       OR recipes.description LIKE '%${search}%')
      and (recipes.prep_time + recipes.cook_time) <= ${time}
      and recipes.id NOT IN(
      Select recipe_ingredients.recipeId from recipe_ingredients
      WHERE recipe_ingredients.ingredientId IN(${withoutIngredientIds}))

      GROUP BY recipes.id
      HAVING COUNT(recipe_tags.tagId) = ${countTags})

      and  recipe_ingredients.ingredientId IN(${withIngredientIds})
      GROUP BY recipes.id
      HAVING COUNT(recipe_ingredients.ingredientId) = ${countWithIngredients}
      ) as t1`;
  return query(builQueryObj(rawQueryStr));
});

export const getCountRecipesByFiltersExcludeIngredients = R.curry((httpQuery, query) => {
  let {tagIds, countTags, search, time, withoutIngredientIds} = httpQuery;
  if (!tagIds || !countTags || !time || !withoutIngredientIds) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    Select count(1) as totalRecipes from
    (SELECT
    (recipes.prep_time + recipes.cook_time) as total_time from recipes

    JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    Where recipe_tags.tagId IN(${tagIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
      OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    and recipes.id NOT IN(
    Select recipe_ingredients.recipeId from recipe_ingredients
    WHERE recipe_ingredients.ingredientId IN(${withoutIngredientIds}))

    GROUP BY recipes.id
    HAVING COUNT(recipe_tags.tagId) = ${countTags}
    ) as t1`;
  return query(builQueryObj(rawQueryStr));
});

export const getCountRecipesByFiltersIncludeIngredients = R.curry((httpQuery, query) => {
  let {tagIds, countTags, search, time, withIngredientIds, countWithIngredients} = httpQuery;
  if (!tagIds || !countTags || !time || !withIngredientIds || countWithIngredients) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    Select count(1) as totalRecipes from
    (SELECT
    (recipes.prep_time + recipes.cook_time) as total_time from recipes

    JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipeId
    Where recipes.id IN(SELECT recipes.id from recipes
    JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    Where recipe_tags.tagId IN(${tagIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
      OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}

    GROUP BY recipes.id
    HAVING COUNT(recipe_tags.tagId) = ${countTags})

    and  recipe_ingredients.ingredientId IN(${withIngredientIds})
    GROUP BY recipes.id
    HAVING COUNT(recipe_ingredients.ingredientId) = ${countWithIngredients}
    ) as t1`;
  return query(builQueryObj(rawQueryStr));
});

export const getCountRecipesByIngredientId = R.curry((httpQuery, query) => {
  let {recipeIds, ingredientId} = httpQuery;
  if (!recipeIds || !ingredientId) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT count(recipes.id) as total_count from recipes
    JOIN recipe_ingredients on recipe_ingredients.recipeId = recipes.id
    WHERE recipes.id IN(${recipeIds}) and recipe_ingredients.ingredientId = ${ingredientId}`;
  return query(builQueryObj(rawQueryStr));
});

export const getCountRecipesByIngredients = R.curry((httpQuery, query) => {
  let {withIngredientIds, countWithIngredients, search, time, withoutIngredientIds} = httpQuery;
  if (!withIngredientIds || !countWithIngredients || !time || !withoutIngredientIds) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    Select count(1) as totalRecipes from
    (SELECT
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipeId
    WHERE recipe_ingredients.ingredientId IN(${withIngredientIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
      OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    and recipes.id NOT IN(Select recipe_ingredients.recipeId from recipe_ingredients
    WHERE recipe_ingredients.ingredientId IN(${withoutIngredientIds}))
    GROUP BY recipes.id
    HAVING COUNT(recipe_ingredients.ingredientId) = ${countWithIngredients}) as t1`;
  return query(builQueryObj(rawQueryStr));
});

export const getCountRecipesByTags = R.curry((httpQuery, query) => {
  let {tagIds, countTags, search, time} = httpQuery;
  if (!tagIds || !countTags || !time) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    Select count(1) as totalRecipes from
    (SELECT
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    Where recipe_tags.tagId IN(${tagIds})
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
      OR recipes.description LIKE '%${search}%')
    and (recipes.prep_time + recipes.cook_time) <= ${time}
    GROUP BY recipes.id
    HAVING COUNT(recipe_tags.tagId) = ${countTags}) as t1`;
  return query(builQueryObj(rawQueryStr));
});

export const getCountRecipesByTime = R.curry((httpQuery, query) => {
  let {time, search} = httpQuery;
  if (!time) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    Select count(1) as totalRecipes from
    (SELECT
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    WHERE (recipes.prep_time + recipes.cook_time) <= ${time}
    and (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
      OR recipes.description LIKE '%${search}%')) as t1`;
  return query(builQueryObj(rawQueryStr));
});

// export const name = R.curry((httpQuery, query) => {
//   let {} = httpQuery;
//   if (!) {
//     throw invalidInputError;
//   }
//   const rawQueryStr = `

//     `;
//   return query(builQueryObj(rawQueryStr));
// });
