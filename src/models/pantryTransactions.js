import R, {compose as o} from 'ramda';
import pantryTransactions from '../tables/pantryTransactions';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = pantryTransactions.literal(1);

const byId = ({id}) => id ? pantryTransactions.id.equals(id) : TRUE;

const byDeleted = ({is_deleted}) => is_deleted === '1' ?
  TRUE : pantryTransactions.is_deleted.notEqual(1);

export const findAll = R.curry((httpQuery, query) => query(
  pantryTransactions
    .select()
    .where(byId(httpQuery))
    .where(byDeleted(httpQuery))
    .order(pantryTransactions.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(pantryTransactions, findById);

export const create = R.curry(async (pantryTransaction, sess, query) => {
  const {pantryId} = pantryTransaction;
  if (pantryId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(pantryTransaction), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, pantryTransaction, sess, query) => {
  const prepare = o(R.omit(['id', 'is_deleted']));

  return await singular.update(id, prepare(pantryTransaction), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
