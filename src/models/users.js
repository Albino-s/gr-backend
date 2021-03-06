import R, {compose as o} from 'ramda';
import bcrypt from 'bcrypt';
import users from '../tables/users';
import {l} from '../utils/query';
import universal from '../models/universal';
import {invalidInputError, invalidInput} from '../utils/errors';

const TRUE = users.literal(1);

const bySearch = ({search}) => search ?
  users.email.like(l(search)) : TRUE;

const byResetToken = ({resetToken}) => resetToken ? users.resetToken.equals(resetToken) : TRUE;

const byId = ({id}) => id ? users.id.equals(id) : TRUE;

const byEmail = ({email}) => email ?
  users.email.equals(email) : TRUE;

export const findAll = R.curry((httpQuery, query) => query(
  users
    .select()
    .where(bySearch(httpQuery))
    .where(byId(httpQuery))
    .where(byEmail(httpQuery))
    .where(byResetToken(httpQuery))
    .order(users.id)
));

export const findById = universal.findById(findAll);

const singular = universal.singular(users, findById);

export const create = R.curry(async (user, sess, query) => {
  const {email, password, firstName, lastName} = user;
  if (!email || !email.trim()) {
    throw invalidInput("Email is required");
  }
  const existingUsers = await findAll({email}, query);
  if (existingUsers.length) {
    throw invalidInput(`User ${email} already exists`);
  }
  if (!password || password.trim().length < 6) {
    throw invalidInput("Password must be at least 6 characters long");
  }

  if (firstName && lastName) {
    user.servings = user.servings || 4;
    user.password = bcrypt.hashSync(password.trim(), 10);
    const prepare = o(R.omit(['id']));
    return await singular.create(prepare(user), sess, query);
  }
  throw invalidInputError;
});

export const update = R.curry(async (id, userSeed, sess, query) => {
  const prepare = o(R.omit(['id', 'email', 'modified', 'oldPassword']));
  if (userSeed.password) {
    if (userSeed.oldPassword) {
      const user = await findById(id, query);
      if (!user || R.isEmpty(user) || !user.password ||
       !bcrypt.compareSync(userSeed.oldPassword, user.password)) {
        throw invalidInput("Wrong Current Password.");
      }
    }
    if (userSeed.password.trim() && userSeed.password.trim().length > 5) {
      userSeed.password = bcrypt.hashSync(userSeed.password.trim(), 10);
    } else {
      throw invalidInput("Password must be at least 6 characters long");
    }
  }
  return await singular.update(id, prepare(userSeed), sess, query);
});

export const remove = singular.remove;

export default {findAll, findById, create, update, remove};
