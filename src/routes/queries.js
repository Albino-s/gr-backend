import {Router} from 'express';
import * as Queries from '../models/queries';
import * as CountQueries from '../models/queriesCount';
import * as ListQueries from '../models/queriesList';
import * as RecipesQueries from '../models/queriesRecipes';
import {jail} from '../utils/errors';
import {my} from '../utils/query';

const router = new Router();

router
  .get('/getCategoryIdsByUserPantry', jail(async (req, res) => {
    res.send(await my(CountQueries.getCategoryIdsByUserPantry({...req.query})));
  }))
  .get('/getCountRecipesByFilters', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByFilters({...req.query})));
  }))
  .get('/getCountRecipesByFiltersExcludeIngredients', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByFiltersExcludeIngredients({...req.query})));
  }))
  .get('/getCountRecipesByFiltersIncludeIngredients', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByFiltersIncludeIngredients({...req.query})));
  }))
  // SQL queries part 2;
  .get('/getCountRecipesByIngredientId', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByIngredientId({...req.query})));
  }))
  .get('/getCountRecipesByIngredients', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByIngredients({...req.query})));
  }))
  .get('/getCountRecipesByTags', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByTags({...req.query})));
  }))
  .get('/getCountRecipesByTime', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByTime({...req.query})));
  }))
  // SQL queries part 3;
  .get('/getCountRecipesByWithIngredients', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByWithIngredients({...req.query})));
  }))
  .get('/getCountRecipesByWithoutIngredients', jail(async (req, res) => {
    res.send(await my(CountQueries.getCountRecipesByWithoutIngredients({...req.query})));
  }))
  .get('/getIngredientIdsWithProduct', jail(async (req, res) => {
    res.send(await my(Queries.getIngredientIdsWithProduct({...req.query})));
  }))
  .get('/getListIngredients', jail(async (req, res) => {
    res.send(await my(ListQueries.getListIngredients({...req.query})));
  }))
  // SQL queries part 4;
  .get('/getListPantriesByIngredientIds', jail(async (req, res) => {
    res.send(await my(ListQueries.getListPantriesByIngredientIds({...req.query})));
  }))
  .get('/getListPantriesByUserId', jail(async (req, res) => {
    res.send(await my(ListQueries.getListPantriesByUserId({...req.query})));
  }))
  .get('/getListProductByWithoutIngredientIds', jail(async (req, res) => {
    res.send(await my(ListQueries.getListProductByWithoutIngredientIds({...req.query})));
  }))
  .get('/getListProductsFromPantryByUserId', jail(async (req, res) => {
    res.send(await my(ListQueries.getListProductsFromPantryByUserId({...req.query})));
  }))
  // SQL queries part 5;
  .get('/getListRecipesByIds', jail(async (req, res) => {
    res.send(await my(ListQueries.getListRecipesByIds({...req.query})));
  }))
  .get('/getListRecipesByIngredientIds', jail(async (req, res) => {
    res.send(await my(ListQueries.getListRecipesByIngredientIds({...req.query})));
  }))
  .get('/getListRecipesWithSearchForWebAdmin', jail(async (req, res) => {
    res.send(await my(ListQueries.getListRecipesWithSearchForWebAdmin({...req.query})));
  }))
  .get('/getListTags', jail(async (req, res) => {
    res.send(await my(ListQueries.getListTags({...req.query})));
  }))
  // SQL queries part 6;
  .get('/getListUnits', jail(async (req, res) => {
    res.send(await my(ListQueries.getListUnits({...req.query})));
  }))
  .get('/getMinMaxCookTimes', jail(async (req, res) => {
    res.send(await my(Queries.getMinMaxCookTimes({...req.query})));
  }))
  .get('/getProductFromPantryById', jail(async (req, res) => {
    res.send(await my(Queries.getProductFromPantryById({...req.query})));
  }))
  .get('/getProductsByIngredientIds', jail(async (req, res) => {
    res.send(await my(Queries.getProductsByIngredientIds({...req.query})));
  }))
  // SQL queries part 7;
  .get('/getQuickAndEasyRecipes', jail(async (req, res) => {
    res.send(await my(Queries.getQuickAndEasyRecipes({...req.query})));
  }))
  .get('/getRecipeIngredientsByIngredientIds', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipeIngredientsByIngredientIds({...req.query})));
  }))
  .get('/getRecipesByFilters', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByFilters({...req.query})));
  }))
  .get('/getRecipesByFiltersExcludeIngredients', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByFiltersExcludeIngredients({...req.query})));
  }))
  // SQL queries part 8;
  .get('/getRecipesByFiltersIncludeIngredients', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByFiltersIncludeIngredients({...req.query})));
  }))
  .get('/getRecipesByIngredients', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByIngredients({...req.query})));
  }))
  .get('/getRecipesByTags', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByTags({...req.query})));
  }))
  .get('/getRecipesByTime', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByTime({...req.query})));
  }))
  // SQL queries part 9;
  .get('/getRecipesByWithIngredients', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByWithIngredients({...req.query})));
  }))
  .get('/getRecipesByWithoutIngredients', jail(async (req, res) => {
    res.send(await my(RecipesQueries.getRecipesByWithoutIngredients({...req.query})));
  }))
  .get('/getUnitIngredientFromRecipe', jail(async (req, res) => {
    res.send(await my(Queries.getUnitIngredientFromRecipe({...req.query})));
  }))
  .get('/searchRecipesByTotalTime', jail(async (req, res) => {
    res.send(await my(Queries.searchRecipesByTotalTime({...req.query})));
  }))
  .get('/removeRecipeTags', jail(async (req, res) => {
    res.send(await my(Queries.removeRecipeTags({...req.query})));
  }))
  .get('/getListRecipeFavoriteIds', jail(async (req, res) => {
    res.send(await my(ListQueries.getListRecipeFavoriteIds({...req.query})));
  }))
  .get('/getListRecipeFavorites', jail(async (req, res) => {
    res.send(await my(ListQueries.getListRecipeFavorites({...req.query})));
  }))
  .get('/getQuickAndEasyRecipesWithoutFavorite', jail(async (req, res) => {
    res.send(await my(Queries.getQuickAndEasyRecipesWithoutFavorite({...req.query})));
  }))
  .get('/getNutrition', jail(async (req, res) => {
    res.send(await my(Queries.getNutrition({...req.query})));
  }))
  .get('/getUserRecipesHistory', jail(async (req, res) => {
    res.send(await my(Queries.getUserRecipesHistory({...req.query})));
  }))
  .get('/removeRecipeFavorite', jail(async (req, res) => {
    res.send(await my(Queries.removeRecipeFavorite({...req.query})));
  }))
  .get('/getListIngredientsWithSearchForWebAdmin', jail(async (req, res) => {
    res.send(await my(ListQueries.getListIngredientsWithSearchForWebAdmin({...req.query})));
  }))
  .get('/getListProducts', jail(async (req, res) => {
    res.send(await my(ListQueries.getListProducts({...req.query})));
  }))
  .get('/getListProductsWithSearchForWebAdmin', jail(async (req, res) => {
    res.send(await my(ListQueries.getListProductsWithSearchForWebAdmin({...req.query})));
  }));

export default router;
