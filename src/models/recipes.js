import R, {compose as o} from 'ramda';
import recipes from '../tables/recipes';
import {l} from '../utils/query';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = recipes.literal(1);

const bySearch = ({search}) => search ?
  recipes.name.like(l(search)) : TRUE;

const byId = ({id}) => id ? recipes.id.equals(id) : TRUE;

const byDeleted = ({is_deleted}) => is_deleted === '1' ?
  TRUE : recipes.is_deleted.notEqual(1);

export const findAll = R.curry((httpQuery, query) => query(
  recipes
    .select()
    .where(bySearch(httpQuery))
    .where(byId(httpQuery))
    .where(byDeleted(httpQuery))
    .order(recipes.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(recipes, findById);

export const create = R.curry(async (recipe, sess, query) => {
  const {name} = recipe;
  if (name) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(recipe), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, recipe, sess, query) => {
  const prepare = o(R.omit(['id', 'is_deleted']));

  return await singular.update(id, prepare(recipe), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
