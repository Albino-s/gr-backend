import {Router} from 'express';
import usaStandartUnitView from '../views/usaStandartUnit';
import UsaStandartUnits from '../models/usaStandartUnits';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(UsaStandartUnits);

router.param('id', routes.param('usaStandartUnit'));

router.route('/:id?')
  .get(...routes.read(usaStandartUnitView, 'usaStandartUnit'))
  .post(...routes.create(usaStandartUnitView))
  .put(...routes.update(usaStandartUnitView, 'usaStandartUnit'))
  .delete(...routes.remove('usaStandartUnit'));

export default router;
