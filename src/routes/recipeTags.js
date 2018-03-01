import {Router} from 'express';
import recipeTagView from '../views/recipeTag';
import RecipeTags from '../models/recipeTags';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(RecipeTags);

router.param('id', routes.param('recipeTag'));

router.route('/:id?')
  .get(...routes.read(recipeTagView, 'recipeTag'))
  .post(...routes.create(recipeTagView))
  .put(...routes.update(recipeTagView, 'recipeTag'))
  .delete(...routes.remove('recipeTag', true));

export default router;
