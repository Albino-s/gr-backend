import {Router} from 'express';
import userView from '../views/user';
import Users from '../models/users';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(Users);

router.param('id', routes.param('user'));

router.route('/:id?')
  .get(...routes.read(userView, 'user'))
  .post(...routes.create(userView))
  .put(...routes.update(userView, 'user'))
  .delete(...routes.remove('user'));

export default router;
