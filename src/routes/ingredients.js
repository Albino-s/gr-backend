import {Router} from 'express';
import ingredientView from '../views/ingredient';
import Ingredients from '../models/ingredients';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(Ingredients);

router.param('id', routes.param('ingredient'));

router.route('/:id?')
  .get(...routes.read(ingredientView, 'ingredient'))
  .post(...routes.create(ingredientView))
  .put(...routes.update(ingredientView, 'ingredient'))
  .delete(...routes.remove('ingredient', true));

export default router;
