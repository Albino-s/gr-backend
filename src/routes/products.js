import {Router} from 'express';
import productView from '../views/product';
import Products from '../models/products';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(Products);

router.param('id', routes.param('product'));

router.route('/:id?')
  .get(...routes.read(productView, 'product'))
  .post(...routes.create(productView))
  .put(...routes.update(productView, 'product'))
  .delete(...routes.remove('product', true));

export default router;
