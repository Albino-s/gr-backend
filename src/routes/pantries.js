import {Router} from 'express';
import pantryView from '../views/pantry';
import Pantries from '../models/pantries';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(Pantries);

router.param('id', routes.param('pantry'));

router.route('/:id?')
  .get(...routes.read(pantryView, 'pantry'))
  .post(...routes.create(pantryView))
  .put(...routes.update(pantryView, 'pantry'))
  .delete(...routes.remove('pantry', true));

export default router;
