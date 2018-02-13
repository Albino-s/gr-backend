import R, {compose as o} from 'ramda';
import usaStandartUnits from '../tables/usaStandartUnits';
import {l} from '../utils/query';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = usaStandartUnits.literal(1);

const bySearch = ({search}) => search ?
  usaStandartUnits.name.like(l(search)) : TRUE;

const byId = ({id}) => id ? usaStandartUnits.id.equals(id) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  usaStandartUnits
    .select()
    .where(bySearch(httpQuery))
    .where(byId(httpQuery))
    .order(usaStandartUnits.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(usaStandartUnits, findById);

export const create = R.curry(async (usaStandartUnit, sess, query) => {
  const {name, full_name, short_name_plural} = usaStandartUnit;
  if (name && full_name && short_name_plural) {
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(usaStandartUnit), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, usaStandartUnit, sess, query) => {
  const prepare = o(R.omit(['id']));

  return await singular.update(id, prepare(usaStandartUnit), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
