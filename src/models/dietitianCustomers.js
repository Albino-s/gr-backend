import R, {compose as o} from 'ramda';
import dietitianCustomers from '../tables/dietitianCustomers';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = dietitianCustomers.literal(1);

const byId = ({id}) => id ? dietitianCustomers.id.equals(id) : TRUE;

const byUserId = ({userId}) => userId ? dietitianCustomers.userId.equals(userId) : TRUE;

const byDietitianId = ({dietitianId}) => dietitianId ?
  dietitianCustomers.dietitianId.equals(dietitianId) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  dietitianCustomers
    .select()
    .where(byId(httpQuery))
    .where(byUserId(httpQuery))
    .where(byDietitianId(httpQuery))
    .order(dietitianCustomers.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(dietitianCustomers, findById);

export const create = R.curry(async (dietitianCustomer, sess, query) => {
  const {userId, dietitianId} = dietitianCustomer;
  if (userId && dietitianId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(dietitianCustomer), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, dietitianCustomer, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(dietitianCustomer), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
