import {Router} from 'express';
import recipeFavoriteView from '../views/recipeFavorite';
import RecipeFavorites from '../models/recipeFavorites';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(RecipeFavorites);

router.param('id', routes.param('recipeFavorite'));

router.route('/:id?')
  .get(...routes.read(recipeFavoriteView, 'recipeFavorite'))
  .post(...routes.create(recipeFavoriteView))
  .put(...routes.update(recipeFavoriteView, 'recipeFavorite'))
  .delete(...routes.remove('recipeFavorite'));

export default router;
