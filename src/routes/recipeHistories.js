import {Router} from 'express';
import recipeHistoryView from '../views/recipeHistory';
import RecipeHistories from '../models/recipeHistories';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(RecipeHistories);

router.param('id', routes.param('recipeHistory'));

router.route('/:id?')
  .get(...routes.read(recipeHistoryView, 'recipeHistory'))
  .post(...routes.create(recipeHistoryView))
  .put(...routes.update(recipeHistoryView, 'recipeHistory'))
  .delete(...routes.remove('recipeHistory'));

export default router;
