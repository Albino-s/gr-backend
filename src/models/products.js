import R, {compose as o} from 'ramda';
import products from '../tables/products';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';
import {l} from '../utils/query';

const TRUE = products.literal(1);

const bySearch = ({search}) => search ? products.name.like(l(search)) : TRUE;

const byId = ({id}) => id ? products.id.equals(id) : TRUE;

const byDeleted = ({is_deleted}) => is_deleted === '1' ?
  TRUE : products.is_deleted.notEqual(1);

export const findAll = R.curry((httpQuery, query) => query(
  products
    .select()
    .where(byId(httpQuery))
    .where(byDeleted(httpQuery))
    .where(bySearch(httpQuery))
    .order(products.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(products, findById);

export const create = R.curry(async (product, sess, query) => {
  const {ingredientProduct, unitProduct} = product;
  if (ingredientProduct && unitProduct) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(product), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, product, sess, query) => {
  const prepare = o(R.omit(['id', 'is_deleted']));

  return await singular.update(id, prepare(product), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
