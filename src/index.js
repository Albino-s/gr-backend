import sql from 'sql';
import express from 'express';
import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import routes from './routes';
import docs from './routes/docs';
// import {auth} from 'config';
import {customValidators, customSanitizers} from './utils/validators';

sql.setDialect('mysql');

// const getToken = req => {
//   const {headers: {authorization}, query} = req;
//   if (authorization && authorization.split(' ')[0] === 'Bearer') {
//     return authorization.split(' ')[1];
//   } else if (query && query.token) {
//     return query.token;
//   }
//   return null;
// };

const setSessUser = (req, res, next) => {
  req.sess = req.sess || {};
  req.sess.email = req.user && req.user.email;
  next();
};

// const auth0Middleware = jwt({
//   secret: secretCallback,
//   getToken,
//   algorithms: ['RS256', 'HS256']
// }).unless({path: ['/auth/token', '/auth/signup']});

const app = express();

app.use(bodyParser.json({
  limit: '5MB'
}));

app.use(expressValidator({customValidators, customSanitizers}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'POST,GET,OPTIONS,PUT,DELETE,HEAD,PATCH'
  );
  next();
});

// app.use(auth0Middleware, setSessUser);
app.use('/docs', docs);
app.use(routes);

export const errorCatcher =
(err, _, res, next /* eslint no-unused-vars: 0 */) => {
  const status = err.status || err.code || 400;
  res
    .status(status)
    .send({
      code: status,
      message: err.message
    });
};

app.use(errorCatcher);

export default app;
