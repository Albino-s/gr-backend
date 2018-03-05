import {Router} from 'express';
import productCategoryView from '../views/productCategory';
import ProductCategories from '../models/productCategories';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(ProductCategories);

router.param('id', routes.param('productCategory'));

router.route('/:id?')
  .get(...routes.read(productCategoryView, 'productCategory'))
  .post(...routes.create(productCategoryView))
  .put(...routes.update(productCategoryView, 'productCategory'))
  .delete(...routes.remove('productCategory'));

export default router;
