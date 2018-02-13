import {Router} from 'express';

import auth from './auth';
import users from './users';
import euStandartUnits from './euStandartUnits';
import usaStandartUnits from './usaStandartUnits';
import ingredients from './ingredients';

const api = new Router();

api.use('/v1/auth', auth);
api.use('/v1/users', users);
api.use('/v1/eu_standart_units', euStandartUnits);
api.use('/v1/usa_standart_units', usaStandartUnits);
api.use('/v1/ingredients', ingredients);

export default api;
