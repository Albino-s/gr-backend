import {Router} from 'express';
import userView from '../views/user';
import Users from '../models/users';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(Users);

router.param('id', routes.param('userData'));

router.route('/:id?')
  .get(...routes.read(userView, 'userData'))
  .post(...routes.create(userView))
  .put(...routes.update(userView, 'userData'))
  .delete(...routes.remove('userData'));

export default router;
