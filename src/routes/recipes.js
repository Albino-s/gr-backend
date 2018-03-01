import {Router} from 'express';
import recipeView from '../views/recipe';
import Recipes from '../models/recipes';
import RecipeIngredients from '../models/recipeIngredients';
import universal from '../routes/universal';
import R from 'ramda';
import {my} from '../utils/query';
import {notFoundError} from '../utils/errors';
import multipleView from '../views/multipleView';

const router = new Router();

const routes = universal.router(Recipes);

router.param('id', routes.param('recipe'));

router.route('/:id?')
  .get(universal.route(200, async req => {
    return await my(async query => {
      if (req.recipe) {
        const recipe = R.head(await Recipes.findAll(req.recipe, query));
        if (!recipe || R.isEmpty(recipe)) {
          throw notFoundError;
        }
        if (req.query && req.query.deep === 'true') {
          recipe.ingredientrecipe = await RecipeIngredients.findAll({recipeId: recipe.id,
            withRelations: '1'}, query);
        }
        return recipeView(recipe);
      }
      const recipes = await Recipes.findAll(req.query, query);
      return multipleView(R.map(recipeView, recipes), {totalRows: recipes.length});
    });
  }))
  .post(...routes.create(recipeView))
  .put(...routes.update(recipeView, 'recipe'))
  .delete(...routes.remove('recipe', true));

export default router;
