import R, {compose as o} from 'ramda';
import euStandartUnits from '../tables/euStandartUnits';
import {l} from '../utils/query';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = euStandartUnits.literal(1);

const bySearch = ({search}) => search ?
  euStandartUnits.name.like(l(search)) : TRUE;

const byId = ({id}) => id ? euStandartUnits.id.equals(id) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  euStandartUnits
    .select()
    .where(bySearch(httpQuery))
    .where(byId(httpQuery))
    .order(euStandartUnits.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(euStandartUnits, findById);

export const create = R.curry(async (euStandartUnit, sess, query) => {
  const {name, full_name, short_name_plural} = euStandartUnit;
  if (name && full_name && short_name_plural) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(euStandartUnit), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, euStandartUnit, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(euStandartUnit), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
