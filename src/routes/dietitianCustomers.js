import {Router} from 'express';
import dietitianCustomerView from '../views/dietitianCustomer';
import DietitianCustomers from '../models/dietitianCustomers';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(DietitianCustomers);

router.param('id', routes.param('dietitianCustomer'));

router.route('/:id?')
  .get(...routes.read(dietitianCustomerView, 'dietitianCustomer'))
  .post(...routes.create(dietitianCustomerView))
  .put(...routes.update(dietitianCustomerView, 'dietitianCustomer'))
  .delete(...routes.remove('dietitianCustomer'));

export default router;
