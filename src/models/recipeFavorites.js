import R, {compose as o} from 'ramda';
import recipeFavorites from '../tables/recipeFavorites';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = recipeFavorites.literal(1);

const byId = ({id}) => id ? recipeFavorites.id.equals(id) : TRUE;

const byUserId = ({userId}) => userId ? recipeFavorites.userId.equals(userId) : TRUE;

const byRecipeId = ({recipeId}) => recipeId ? recipeFavorites.recipeId.equals(recipeId) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  recipeFavorites
    .select()
    .where(byId(httpQuery))
    .where(byUserId(httpQuery))
    .where(byRecipeId(httpQuery))
    .order(recipeFavorites.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(recipeFavorites, findById);

export const create = R.curry(async (recipeFavorite, sess, query) => {
  const {recipeId, userId} = recipeFavorite;
  if (recipeId && userId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(recipeFavorite), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, recipeFavorite, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(recipeFavorite), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
