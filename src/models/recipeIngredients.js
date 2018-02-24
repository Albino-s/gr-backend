import R, {compose as o} from 'ramda';
import recipeIngredients from '../tables/recipeIngredients';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = recipeIngredients.literal(1);

const byId = ({id}) => id ? recipeIngredients.id.equals(id) : TRUE;

const byRecipeId = ({recipeId}) => recipeId ? recipeIngredients.recipeId.equals(recipeId) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  recipeIngredients
    .select()
    .where(byId(httpQuery))
    .where(byRecipeId(httpQuery))
    .order(recipeIngredients.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(recipeIngredients, findById);

export const create = R.curry(async (recipeIngredient, sess, query) => {
  const {recipeId, ingredientId} = recipeIngredient;
  if (recipeId && ingredientId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(recipeIngredient), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, recipeIngredient, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(recipeIngredient), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
