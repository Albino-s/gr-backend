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
import {generateToken, promisify} from '../utils/functions';
import {mailer, appName, api} from 'config';
import crypto from 'crypto';
import {join} from 'path';
import formidable from 'formidable';

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

router.route('/forgot').post(bodyType('Object'), jail(async (req, res) => {
  const {body: {email}} = req;
  if (!email) {
    throw invalidInputError;
  }
  const user = await my(async query => {
    return R.head(await Users.findAll({email}, query));
  });
  if (!user || R.isEmpty(user)) {
    throw invalidInputError;
  }
  const token = (await promisify(cb => crypto.randomBytes(20, cb))).toString('hex');
  await my(async query => {
    await Users.update(user.id, {resetToken: token}, {}, query);
  });

  const smtpTransport = nodemailer.createTransport(mailer.options);
  const mailOptions = {
    to: email,
    from: mailer.from,
    subject: 'Password Reset',
    html: `<!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
        <head>
        </head>
        <body>
          <p>Dear ${user.firstName} ${user.lastName},</p>
          <br>
          <p>
            You have requested to have your password reset for your account.
          </p>
          <p>Please use this
<a href="${api.url}/${api.path}/${api.resetPassUrl}?token=${token}&email=${user.email}">link</a>
            to reset your password.
          </p>
          <strong>If you didn't make this request, you can ignore this email.</strong>
          <br>
          <br>
          <p>The ${appName} Support Team</p>
        </body>
      </html>`
  };
  res.send(await promisify(cb => smtpTransport.sendMail(mailOptions, cb)));
}));

const sendFile = file => (_, res) => {
  res.sendFile(join(process.cwd(), file));
};

router.get('/reset-password', sendFile('api/reset-password.html'));

router.route('/new-password').post(bodyType('Object'), jail(async (req, res) => {
  const {query: {token, email}} = req;
  var form = new formidable.IncomingForm();
  const {password} = await promisify(cb => form.parse(req, cb));
  if (!email || !password || !token) {
    throw invalidInputError;
  }
  const user = await my(async query => {
    return R.head(await Users.findAll({email, resetToken: token}, query));
  });
  if (!user || R.isEmpty(user)) {
    throw invalidInputError;
  }

  res.send(await my(async query => {
    await Users.update(user.id, {resetToken: null, password}, {}, query);
  }));
}));

export default router;
