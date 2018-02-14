import R, {compose as o} from 'ramda';
import ingredients from '../tables/ingredients';
import {l} from '../utils/query';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = ingredients.literal(1);

const bySearch = ({search}) => search ?
  ingredients.name_plural.like(l(search)) : TRUE;

const byId = ({id}) => id ? ingredients.id.equals(id) : TRUE;

const byDeleted = ({is_deleted}) => is_deleted === '1' ?
  TRUE : ingredients.is_deleted.notEqual(1);

export const findAll = R.curry((httpQuery, query) => query(
  ingredients
    .select()
    .where(bySearch(httpQuery))
    .where(byId(httpQuery))
    .where(byDeleted(httpQuery))
    .order(ingredients.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(ingredients, findById);

export const create = R.curry(async (ingredient, sess, query) => {
  const {name_singular, name_plural} = ingredient;
  if (name_singular && name_plural) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(ingredient), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, ingredient, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(ingredient), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
