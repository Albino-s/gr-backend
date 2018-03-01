import {Router} from 'express';
import tagView from '../views/recipeTag';
import Tags from '../models/recipeTags';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(Tags);

router.param('id', routes.param('tag'));

router.route('/:id?')
  .get(...routes.read(tagView, 'tag'))
  .post(...routes.create(tagView))
  .put(...routes.update(tagView, 'tag'))
  .delete(...routes.remove('tag', true));

export default router;
