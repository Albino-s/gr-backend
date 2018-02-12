import {Router} from 'express';

import auth from './auth';
import users from './users';

const api = new Router();

api.use('/v1/auth', auth);
api.use('/v1/users', users);

export default api;
