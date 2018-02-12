import R, {compose as o} from 'ramda';
import bcrypt from 'bcrypt';
import users from '../tables/users';
import {l} from '../utils/query';
import universal from '../models/universal';
import {invalidInputError} from '../utils/errors';

const TRUE = users.literal(1);

const bySearch = ({search}) => search ?
  users.email.like(l(search)) : TRUE;

const byId = ({id}) => id ? users.id.equals(id) : TRUE;

const byEmail = ({email}) => email ?
  users.email.equals(email) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  users
    .select()
    .where(bySearch(httpQuery))
    .where(byId(httpQuery))
    .where(byEmail(httpQuery))
    .order(users.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(users, findById);

export const create = R.curry(async (user, sess, query) => {
  const {email, password} = user;
  if (email && password && password.length > 3) {
    user.password = bcrypt.hashSync(password, 10);
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(user), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, userSeed, sess, query) => {
  const prepare = o(R.omit(['id']));
  if (userSeed.password) {
    userSeed.password = bcrypt.hashSync(userSeed.password, 10);
  }
  return await singular.update(id, prepare(userSeed), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
