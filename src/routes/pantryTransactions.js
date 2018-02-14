import {Router} from 'express';
import pantryTransactionView from '../views/pantryTransaction';
import PantryTransactions from '../models/pantryTransactions';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(PantryTransactions);

router.param('id', routes.param('pantryTransaction'));

router.route('/:id?')
  .get(...routes.read(pantryTransactionView, 'pantryTransaction'))
  .post(...routes.create(pantryTransactionView))
  .put(...routes.update(pantryTransactionView, 'pantryTransaction'))
  .delete(...routes.remove('pantryTransaction', true));

export default router;
