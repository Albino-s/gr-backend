import {Router} from 'express';
import recipeView from '../views/recipe';
import Recipes from '../models/recipes';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(Recipes);

router.param('id', routes.param('recipe'));

router.route('/:id?')
  .get(...routes.read(recipeView, 'recipe'))
  .post(...routes.create(recipeView))
  .put(...routes.update(recipeView, 'recipe'))
  .delete(...routes.remove('recipe', true));

export default router;
