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
    SELECT products.ingredientProduct, products.id, products.name, products.price, products.store,
    products.size, products.unitProduct as unit_product, product_categories.name as category_name,
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
    GROUP BY products.ingredientProduct, products.id`;
  return query(builQueryObj(rawQueryStr));
});
// --- Original getListProductByWithoutIngredientIds -----
// SELECT products.id, products.name, products.price, products.store, products.size,
// products.unitProduct as unit_product, product_categories.name as category_name,
// ingredients.photo, ingredients.id as ingredientId, ingredients.name_singular as name_singular,
// usa_standart_units.name as unit_name from products
// JOIN ingredients on ingredients.id = products.ingredientProduct
// JOIN product_categories on ingredients.categoryIngredient = product_categories.id
// JOIN usa_standart_units on usa_standart_units.id = products.unitProduct
// WHERE ingredientProduct NOT IN ({{ingredientIds}}) and  products.store  LIKE "%{{nameStore}}%"
// and ingredients.name_singular LIKE "%{{search}}%"
// GROUP BY products.ingredientProduct

export const getListProductsFromPantryByUserId = R.curry((httpQuery, query) => {
  let {userId} = httpQuery;
  if (!userId) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT pantries.*, products.*, ingredients.*, product_categories.name as category_name,
    pantries.id as id
    from pantries
    JOIN products on products.id = pantries.productId
    JOIN ingredients on ingredients.id = products.ingredientProduct
    JOIN product_categories on product_categories.id = ingredients.categoryIngredient
    WHERE pantries.userId = ${userId} and pantries.quantity_us > 0`;
  return query(builQueryObj(rawQueryStr));
});

export const getListRecipesByIds = R.curry((httpQuery, query) => {
  let {recipeIds, pageSize, pageNumber} = httpQuery;
  if (!recipeIds || !pageSize || !pageNumber) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT *,
    (select count(id) from recipes) as total_count,
    (prep_time + cook_time) as total_time from recipes
    WHERE id IN(${recipeIds})
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListRecipesByIngredientIds = R.curry((httpQuery, query) => {
  let {recipeIds, ingredientIds, pageSize, pageNumber} = httpQuery;
  if (!recipeIds || !ingredientIds || !pageSize || !pageNumber) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT *, (prep_time + cook_time) as total_time from recipes
    JOIN recipe_ingredients on recipe_ingredients.recipeId = recipes.id
    WHERE recipes.id IN(${recipeIds}) and recipe_ingredients.ingredientId IN(${ingredientIds})
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListRecipesWithSearchForWebAdmin = R.curry((httpQuery, query) => {
  let {search, pageNumber, pageSize} = httpQuery;
  if (!pageSize || !pageNumber) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT recipes.*, tags.name as tag_name, tags.type as tag_type,
    (recipes.prep_time + recipes.cook_time) as total_time,
    (Select COUNT(1) as totalRows from recipes
        Where (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
        OR recipes.description LIKE '%${search}%') and recipes.is_deleted != 1 ) as totalRows
    from recipes
    LEFT JOIN recipe_tags ON recipes.id = recipe_tags.recipeId
    LEFT JOIN tags on recipe_tags.tagId = tags.id
    Where (recipes.name  LIKE '%${search}%' OR recipes.instructions LIKE '%${search}%'
     OR recipes.description LIKE '%${search}%') and recipes.is_deleted != 1
    GROUP BY recipes.id
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListTags = R.curry((httpQuery, query) => {
  const rawQueryStr = `
    SELECT *
    from tags
    ORDER BY name ASC;`;
  return query(builQueryObj(rawQueryStr));
});

export const getListUnits = R.curry((httpQuery, query) => {
  let {objectName} = httpQuery;
  if (!objectName) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT * from ${objectName}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListRecipeFavoriteIds = R.curry((httpQuery, query) => {
  let {userId} = httpQuery;
  if (!userId) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT recipeId from recipe_favorites
    where userId = ${userId}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListRecipeFavorites = R.curry((httpQuery, query) => {
  let {userId, pageNumber, pageSize} = httpQuery;
  if (!userId || !pageNumber || !pageSize) {
    throw invalidInputError;
  }
  const rawQueryStr = `
    SELECT recipes.*,
    (recipes.prep_time + recipes.cook_time) as total_time from recipes
    JOIN recipe_favorites ON recipes.id = recipe_favorites.recipeId
    where recipe_favorites.userId = ${userId}
    ORDER BY total_time ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListIngredientsWithSearchForWebAdmin = R.curry((httpQuery, query) => {
  let {search, pageNumber, pageSize} = httpQuery;
  if (!pageNumber || !pageSize) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT ingredients.*, product_categories.name as category_name,
     usa_standart_units.full_name as unit_name,
    (Select COUNT(1) as totalRows from ingredients
        Where (ingredients.name_singular  LIKE '%${search}%' OR ingredients.name_plural
    LIKE '%${search}%') ) as totalRows from ingredients
    Join product_categories on product_categories.id = ingredients.categoryIngredient
    Join usa_standart_units on usa_standart_units.id = ingredients.unitIngredient
    Where (ingredients.name_singular  LIKE '%${search}%' OR ingredients.name_plural
    LIKE '%${search}%')
    ORDER BY ingredients.name_singular ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});

export const getListProducts = R.curry((httpQuery, query) => {
  let {search} = httpQuery;
  search = search || '';
  const rawQueryStr = `
    from products
    WHERE name LIKE '%${search}%'
    ORDER BY name ASC`;
  return query(builQueryObj(rawQueryStr));
});

export const getListProductsWithSearchForWebAdmin = R.curry((httpQuery, query) => {
  let {search, pageNumber, pageSize} = httpQuery;
  if (!pageNumber || !pageSize) {
    throw invalidInputError;
  }
  search = search || '';
  const rawQueryStr = `
    SELECT products.*, usa_standart_units.full_name as unit_name,
    (Select COUNT(1) as totalRows from products
        Where (products.name  LIKE '%${search}%')) as totalRows
    from products
    Join usa_standart_units on usa_standart_units.id = products.unitProduct
    Where (products.name  LIKE '%${search}%')
    ORDER BY products.name ASC
    LIMIT ${pageNumber}, ${pageSize}`;
  return query(builQueryObj(rawQueryStr));
});
