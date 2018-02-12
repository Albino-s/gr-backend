import R from 'ramda';
import {my} from '../utils/query';
import {bodyType, id} from '../middlewares/validation';
import {jail, notFoundError} from '../utils/errors';

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
          res.send(R.map(view, await model.findAll(req.query, query)));
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
          req[instance] = await model.findById(req[instance].id, query);
          if (req[instance] && !R.isEmpty(req[instance])) {
            res.status(201).send(await view(
              await model.update(req[instance].id, req.body, req.sess, query)));
          } else {
            res.status(404).send(notFoundError);
          }
        });
      })
    ],

    remove: (instance, ...middlewares) => [
      ...middlewares,
      jail(async (req, res) => {
        await my(async query => {
          req[instance] = await model.findById(req[instance].id, query);
          if (req[instance] && !R.isEmpty(req[instance])) {
            await model.remove(req[instance].id, req.sess, query);
          }
          res.status(204).send();
        });
      })
    ]
  })
};
