import R, {composeP as op} from 'ramda';

export default {
  findById: R.uncurryN(3, (findAll, id) => op(R.head, findAll({id}))),

  singular: (table, findById) => ({
    create: R.curry(async (object, sess, query) => {
      let result = await query(table.insert({
        ...object
      }));
      const id = result.insertId;
      return await findById(id, query);
    }),

    update: R.curry(async (id, object, sess, query) => {
      if (!R.isEmpty(object)) {
        await query(table.update({
          ...object
        }).where({id}));
      }
      return await findById(id, query);
    }),

    remove: R.curry((id, useSoftDelete, sess, query) => {
      if (useSoftDelete) {
        return query(table.update({is_deleted: 1}).where({id}));
      }
      return query(table.delete().where({id}));
    })
  })
};
