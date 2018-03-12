import {Router} from 'express';

import auth from './auth';
import users from './users';
import euStandartUnits from './euStandartUnits';
import usaStandartUnits from './usaStandartUnits';
import ingredients from './ingredients';
import pantries from './pantries';
import productCategories from './productCategories';
import products from './products';
import pantryTransactions from './pantryTransactions';
import recipes from './recipes';
import recipeIngredients from './recipeIngredients';
import recipeFavorites from './recipeFavorites';
import recipeHistories from './recipeHistories';
import recipeNutritions from './recipeNutritions';
import recipeTags from './recipeTags';
import queries from './queries';
import tags from './tags';

const api = new Router();

api.use('/v1/auth', auth);
api.use('/v1/users', users);
api.use('/v1/eu_standart_units', euStandartUnits);
api.use('/v1/usa_standart_units', usaStandartUnits);
api.use('/v1/ingredients', ingredients);
api.use('/v1/pantries', pantries);
api.use('/v1/pantry_transactions', pantryTransactions);
api.use('/v1/product_categories', productCategories);
api.use('/v1/products', products);
api.use('/v1/recipes', recipes);
api.use('/v1/recipe_ingredients', recipeIngredients);
api.use('/v1/recipe_favorites', recipeFavorites);
api.use('/v1/recipe_histories', recipeHistories);
api.use('/v1/recipe_nutritions', recipeNutritions);
api.use('/v1/recipe_tags', recipeTags);
api.use('/v1/queries', queries);
api.use('/v1/tags', tags);

export default api;
