import {Router} from 'express';
import euStandartUnitView from '../views/euStandartUnit';
import EuStandartUnits from '../models/euStandartUnits';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(EuStandartUnits);

router.param('id', routes.param('euStandartUnit'));

router.route('/:id?')
  .get(...routes.read(euStandartUnitView, 'euStandartUnit'))
  .post(...routes.create(euStandartUnitView))
  .put(...routes.update(euStandartUnitView, 'euStandartUnit'))
  .delete(...routes.remove('euStandartUnit'));

export default router;
