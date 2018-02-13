import R from 'ramda';
import {Router} from 'express';
import bcrypt from 'bcrypt';
import userView from '../views/user';
import Users from '../models/users';
import universal from '../routes/universal';
import {notFoundError} from '../utils/errors';
import {bodyType} from '../middlewares/validation';
import {my} from '../utils/query';
import {generateToken} from '../utils/functions';

const router = new Router();

router.post('/token', bodyType('Object'), universal.route(200, async req => {
  const {query: {email, password}} = req;
  return await my(async query => {
    const user = R.head(await Users.findAll({email}, query));
    if (!user || R.isEmpty(user) || !bcrypt.compareSync(password, user.password)) {
      throw notFoundError;
    }
    return {...userView(user), access_token: generateToken({email: user.email})};
  });
}));

router.post('/signup', bodyType('Object'), universal.route(201, async req => {
  return await my(async query => {
    const user = await Users.create(req.body, req.sess, query);
    return {...userView(user), access_token: generateToken({email: user.email})};
  });
}));

export default router;
