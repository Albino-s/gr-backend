import {Router} from 'express';
import * as Queries from '../models/queries';
import * as CountQueries from '../models/queriesCount';
import * as ListQueries from '../models/queriesList';
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
  }));

export default router;
