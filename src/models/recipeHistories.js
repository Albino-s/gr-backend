import R, {compose as o} from 'ramda';
import recipeHistories from '../tables/recipeHistories';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = recipeHistories.literal(1);

const byId = ({id}) => id ? recipeHistories.id.equals(id) : TRUE;

const byUserId = ({userId}) => userId ? recipeHistories.userId.equals(userId) : TRUE;

const byRecipeId = ({recipeId}) => recipeId ? recipeHistories.recipeId.equals(recipeId) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  recipeHistories
    .select()
    .where(byId(httpQuery))
    .where(byUserId(httpQuery))
    .where(byRecipeId(httpQuery))
    .order(recipeHistories.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(recipeHistories, findById);

export const create = R.curry(async (recipeHistory, sess, query) => {
  const {recipeId, userId} = recipeHistory;
  if (recipeId && userId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(recipeHistory), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, recipeHistory, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(recipeHistory), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
