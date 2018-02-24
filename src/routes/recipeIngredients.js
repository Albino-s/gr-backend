import {Router} from 'express';
import recipeIngredientView from '../views/recipeIngredient';
import RecipeIngredients from '../models/recipeIngredients';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(RecipeIngredients);

router.param('id', routes.param('recipeIngredient'));

router.route('/:id?')
  .get(...routes.read(recipeIngredientView, 'recipeIngredient'))
  .post(...routes.create(recipeIngredientView))
  .put(...routes.update(recipeIngredientView, 'recipeIngredient'))
  .delete(...routes.remove('recipeIngredient'));

export default router;
