import {Router} from 'express';

import auth from './auth';
import users from './users';
import euStandartUnits from './euStandartUnits';

const api = new Router();

api.use('/v1/auth', auth);
api.use('/v1/users', users);
api.use('/v1/eu_standart_units', euStandartUnits);

export default api;
