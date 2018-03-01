import {Router} from 'express';
import recipeNutritionView from '../views/recipeNutrition';
import RecipeNutritions from '../models/recipeNutritions';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(RecipeNutritions);

router.param('id', routes.param('recipeNutrition'));

router.route('/:id?')
  .get(...routes.read(recipeNutritionView, 'recipeNutrition'))
  .post(...routes.create(recipeNutritionView))
  .put(...routes.update(recipeNutritionView, 'recipeNutrition'))
  .delete(...routes.remove('recipeNutrition'));

export default router;
