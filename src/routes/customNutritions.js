import {Router} from 'express';
import customNutritionView from '../views/customNutrition';
import CustomNutritions from '../models/customNutritions';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(CustomNutritions);

router.param('id', routes.param('customNutrition'));

router.route('/:id?')
  .get(...routes.read(customNutritionView, 'customNutrition'))
  .post(...routes.create(customNutritionView))
  .put(...routes.update(customNutritionView, 'customNutrition'))
  .delete(...routes.remove('customNutrition'));

export default router;
