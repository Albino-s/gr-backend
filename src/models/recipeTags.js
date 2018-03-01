import R, {compose as o} from 'ramda';
import recipeTags from '../tables/recipeTags';
import recipeTagsRelations from '../tables/recipeTagsWithRelations';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = recipeTags.literal(1);

const byId = ({id}) => id ? recipeTags.id.equals(id) : TRUE;

const byRecipeId = ({recipeId}) => recipeId ? recipeTags.recipeId.equals(recipeId) : TRUE;

const byDeleted = ({is_deleted}) => is_deleted === '1' ?
  TRUE : recipeTags.is_deleted.notEqual(1);

const withRelations = ({withRelations = '0'}) => withRelations === '1';

export const findAll = R.curry((httpQuery, query) => {
  let result;
  if (withRelations(httpQuery)) {
    result = query(
      recipeTagsRelations
        .select()
        .where(byId(httpQuery))
        .where(byRecipeId(httpQuery))
        .order(recipeTags.id));
  } else {
    result = query(
      recipeTags
        .select()
        .where(byId(httpQuery))
        .where(byRecipeId(httpQuery))
        .where(byDeleted(httpQuery))
        .order(recipeTags.id));
  }
  return result;
});

export const findById = universal.findById(findAll);

const singular = universal.singular(recipeTags, findById);

export const create = R.curry(async (recipeTag, sess, query) => {
  const {recipeId, tagId} = recipeTag;
  if (recipeId && tagId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(recipeTag), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, recipeTag, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(recipeTag), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
