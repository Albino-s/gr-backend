import R, {compose as o} from 'ramda';
import dietitianNotes from '../tables/dietitianNotes';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = dietitianNotes.literal(1);

const byId = ({id}) => id ? dietitianNotes.id.equals(id) : TRUE;

const byUserId = ({userId}) => userId ? dietitianNotes.userId.equals(userId) : TRUE;

const byDietitianId = ({dietitianId}) => dietitianId ?
  dietitianNotes.dietitianId.equals(dietitianId) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
      dietitianNotes
        .select()
        .where(byId(httpQuery))
        .where(byUserId(httpQuery))
        .where(byDietitianId(httpQuery))
        .order(dietitianNotes.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(dietitianNotes, findById);

export const create = R.curry(async (dietitianNote, sess, query) => {
  const {userId, dietitianId} = dietitianNote;
  if (userId && dietitianId) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(dietitianNote), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, dietitianNote, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(dietitianNote), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
