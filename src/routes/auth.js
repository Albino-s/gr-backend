import R from 'ramda';
import {Router} from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import userView from '../views/user';
import Users from '../models/users';
import universal from '../routes/universal';
import {jail, invalidCredentialsError, invalidInputError} from '../utils/errors';
import {bodyType} from '../middlewares/validation';
import {my} from '../utils/query';
import {generateToken} from '../utils/functions';
import {mailer} from 'config';

const router = new Router();

router.post('/login', bodyType('Object'), universal.route(200, async req => {
  const {body: {email, password}} = req;
  return await my(async query => {
    if (!email || !password) {
      throw invalidCredentialsError;
    }
    const user = R.head(await Users.findAll({email}, query));
    if (!user || R.isEmpty(user) || !bcrypt.compareSync(password, user.password)) {
      throw invalidCredentialsError;
    }
    return {...userView(user), access_token: generateToken({email: user.email})};
  });
}));

router.post('/token', bodyType('Object'), universal.route(200, async req => {
  const {sess: {email}} = req;
  return await my(async query => {
    if (!email) {
      throw invalidCredentialsError;
    }
    const user = R.head(await Users.findAll({email}, query));
    if (!user || R.isEmpty(user)) {
      throw invalidCredentialsError;
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

router.route('/forgot').post(bodyType('Object'), jail((req, res, next) => {
  const {body: {email}} = req;
  if (!email) {
    throw invalidCredentialsError;
  }
  const smtpTransport = nodemailer.createTransport(mailer.options);
  const mailOptions = {
    to: email,
    from: mailer.from,
    subject: 'Password Reset',
    html: `You have requested to have your password reset for your account`
  };
  smtpTransport.sendMail(mailOptions, (err) => {
    if (!err) {
      res.send({
        message: 'An email has been sent to ' + email + ' with further instructions.'
      });
    }
    next(invalidInputError);
  });
}));

export default router;
