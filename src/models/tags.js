import R, {compose as o} from 'ramda';
import tags from '../tables/tags';
import {l} from '../utils/query';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = tags.literal(1);

const byId = ({id}) => id ? tags.id.equals(id) : TRUE;

const bySearch = ({search}) => search ?
  tags.name.like(l(search)) : TRUE;

const byDeleted = ({is_deleted}) => is_deleted === '1' ?
  TRUE : tags.is_deleted.notEqual(1);

export const findAll = R.curry((httpQuery, query) => query(
  tags
    .select()
    .where(bySearch(httpQuery))
    .where(byId(httpQuery))
    .where(byDeleted(httpQuery))
    .order(tags.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(tags, findById);

export const create = R.curry(async (tag, sess, query) => {
  const {name, type} = tag;
  if (name && type) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(tag), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, tag, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(tag), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
