import R, {compose as o} from 'ramda';
import customNutritions from '../tables/customNutritions';
import customNutritionsWithRelations from '../tables/customNutritionsWithRelations';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = customNutritions.literal(1);

const byId = ({id}) => id ? customNutritions.id.equals(id) : TRUE;

const byUserId = ({userId}) => userId ? customNutritionsWithRelations.userId.equals(userId) : TRUE;

const byCustomerId = ({customerId}) => customerId ?
  customNutritions.customerId.equals(customerId) : TRUE;

const byDietitianId = ({dietitianId}) => dietitianId ?
  customNutritionsWithRelations.dietitianId.equals(dietitianId) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  customNutritionsWithRelations
    .select()
    .where(byId(httpQuery))
    .where(byUserId(httpQuery))
    .where(byCustomerId(httpQuery))
    .where(byDietitianId(httpQuery))
    .order(customNutritions.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(customNutritions, findById);

export const create = R.curry(async (customNutrition, sess, query) => {
  const {customerId} = customNutrition;
  if (customerId) {
    const prepare = o(R.omit(['id', 'userId', 'dietitianId']));
    return await singular.create(prepare(customNutrition), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, customNutrition, sess, query) => {
  const prepare = o(R.omit(['id', 'userId', 'dietitianId']));

  return await singular.update(id, prepare(customNutrition), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
