import R, {compose as o} from 'ramda';
import pantries from '../tables/pantries';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = pantries.literal(1);

const byUserId = ({userId}) => userId ? pantries.userId.equals(userId) : TRUE;

const byProductId = ({productId}) => productId ? pantries.productId.equals(productId) : TRUE;

const byId = ({id}) => id ? pantries.id.equals(id) : TRUE;

const byDeleted = ({is_deleted}) => is_deleted === '1' ?
  TRUE : pantries.is_deleted.notEqual(1);

export const findAll = R.curry((httpQuery, query) => query(
  pantries
    .select()
    .where(byUserId(httpQuery))
    .where(byProductId(httpQuery))
    .where(byId(httpQuery))
    .where(byDeleted(httpQuery))
    .order(pantries.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(pantries, findById);

export const create = R.curry(async (pantry, sess, query) => {
  const {userId, productId} = pantry;
  if (userId && productId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(pantry), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, pantry, sess, query) => {
  const prepare = o(R.omit(['id', 'is_deleted']));

  return await singular.update(id, prepare(pantry), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
