import R, {compose as o} from 'ramda';
import recipeNutritions from '../tables/recipeNutritions';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = recipeNutritions.literal(1);

const byId = ({id}) => id ? recipeNutritions.id.equals(id) : TRUE;

const byRecipeId = ({recipeId}) => recipeId ? recipeNutritions.recipeId.equals(recipeId) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  recipeNutritions
    .select()
    .where(byId(httpQuery))
    .where(byRecipeId(httpQuery))
    .order(recipeNutritions.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(recipeNutritions, findById);

export const create = R.curry(async (recipeNutrition, sess, query) => {
  const {recipeId} = recipeNutrition;
  if (recipeId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(recipeNutrition), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, recipeNutrition, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(recipeNutrition), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
