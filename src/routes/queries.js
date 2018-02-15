import {Router} from 'express';
import * as Queries from '../models/queries';
import {jail} from '../utils/errors';
import {my} from '../utils/query';

const router = new Router();

router
  .get('/getCategoryIdsByUserPantry', jail(async (req, res) => {
    res.send(await my(Queries.getCategoryIdsByUserPantry({...req.query})));
  }))
  .get('/getCountRecipesByFilters', jail(async (req, res) => {
    res.send(await my(Queries.getCountRecipesByFilters({...req.query})));
  }))
  .get('/getCountRecipesByFiltersExcludeIngredients', jail(async (req, res) => {
    res.send(await my(Queries.getCountRecipesByFiltersExcludeIngredients({...req.query})));
  }))
  .get('/getCountRecipesByFiltersIncludeIngredients', jail(async (req, res) => {
    res.send(await my(Queries.getCountRecipesByFiltersIncludeIngredients({...req.query})));
  }));

export default router;
