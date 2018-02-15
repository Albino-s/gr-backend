import R from 'ramda';
import {my} from '../utils/query';
import {bodyType, id} from '../middlewares/validation';
import {jail, notFoundError, invalidInputError} from '../utils/errors';
import multipleView from '../views/multipleView';

export default {
  route: (status, fn) => jail(async (req, res) => {
    res.status(status).send(await fn(req));
  }),
  router: model => ({
    param: (instance) => id(jail(async (req, _, next, id) => {
      req[instance] = {id};
      next();
    })),

    read: (view, instance, ...middlewares) => [
      ...middlewares,
      jail(async (req, res) => {
        await my(async query => {
          if (req[instance]) {
            req[instance] = await model.findById(req[instance].id, query);
            if (!req[instance] || R.isEmpty(req[instance])) {
              return res.status(404).send(notFoundError);
            }
            return res.send(view(req[instance]));
          }
          const result = await model.findAll(req.query, query);
          res.send(multipleView(R.map(view, result), {totalRows: result.length}));
        });
      })
    ],

    create: (view, ...middlewares) => [
      bodyType('Object'),
      ...middlewares,
      jail(async (req, res) => {
        return res.status(201).send(await view(await my(model.create(req.body, req.sess))));
      })
    ],

    update: (view, instance, ...middlewares) => [
      bodyType('Object'),
      ...middlewares,
      jail(async (req, res) => {
        await my(async query => {
          if (req[instance] && req[instance].id) {
            req[instance] = await model.findById(req[instance].id, query);
            if (req[instance] && !R.isEmpty(req[instance])) {
              res.status(201).send(await view(
                await model.update(req[instance].id, req.body, req.sess, query)));
            } else {
              res.status(404).send(notFoundError);
            }
          } else {
            throw invalidInputError;
          }
        });
      })
    ],

    remove: (instance, useSoftDelete = false, ...middlewares) => [
      ...middlewares,
      jail(async (req, res) => {
        await my(async query => {
          if (req[instance] && req[instance].id) {
            req[instance] = await model.findById(req[instance].id, query);
            if (req[instance] && !R.isEmpty(req[instance])) {
              await model.remove(req[instance].id, useSoftDelete, req.sess, query);
            }
            res.status(204).send();
          } else {
            throw invalidInputError;
          }
        });
      })
    ]
  })
};
