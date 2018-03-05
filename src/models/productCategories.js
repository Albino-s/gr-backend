import R, {compose as o} from 'ramda';
import productCategories from '../tables/productCategories';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';
import {l} from '../utils/query';

const TRUE = productCategories.literal(1);

const bySearch = ({search}) => search ? productCategories.name.like(l(search)) : TRUE;

const byId = ({id}) => id ? productCategories.id.equals(id) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  productCategories
    .select()
    .where(byId(httpQuery))
    .where(bySearch(httpQuery))
    .order(productCategories.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(productCategories, findById);

export const create = R.curry(async (productCategory, sess, query) => {
  const {name} = productCategory;
  if (name) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(productCategory), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, productCategory, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(productCategory), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
