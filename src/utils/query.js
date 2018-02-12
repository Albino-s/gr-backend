import R, {composeP as o, pipe as p} from 'ramda';
import mysql from 'mysql';
import sql from 'sql';
import {db} from 'config';
import {promisify} from './functions';

const connect = connection =>
  promisify(cb => connection.connect(cb));

const query = connection => params =>
  promisify(cb => connection.query(...params, cb));

const end = connection =>
  promisify(cb => connection.end(cb));

const toQueryPairs = p(
  R.map(R.invoker(0, 'toQuery')),
  R.map(({text, values}) => [text, values])
);

const transaction = async (query, sql) => {
  try {
    await query(['START TRANSACTION', []]);
    const result = R.is(Function, sql) ?
      await sql(p(R.of, toQueryPairs, R.head, query)) :
      await R.reduce(
        (prev, params) => prev.then(() => query(params)),
        Promise.resolve(),
        toQueryPairs(sql)
      );
    await query(['COMMIT', []]);
    return result;
  } catch (error) {
    await query(['ROLLBACK', []]);
    throw error;
  }
};

export const my = async queries => {
  if (!R.is(Function, queries) && !R.is(Array, queries)) {
    queries = R.of(queries);
  }
  const conn = mysql.createConnection(db);
  try {
    await connect(conn);
    const result = await transaction(query(conn), queries);
    await end(conn);
    return result;
  } catch (error) {
    conn.destroy();
    throw error;
  }
};

export const one = o(R.head, my);

export const lastId = sql.functionCallCreator('LAST_INSERT_ID')().as('id');

export const now = sql.functionCallCreator('NOW');

export const l = x => `%${x}%`;

export const fromUnixTime = sql.functionCallCreator('from_unixtime');

export const json = sql.functionCallCreator('JSON_EXTRACT');

export const sqlLength = sql.functionCallCreator('LENGTH');

export const builQueryObj = queryStr => {
  return {
    toQuery: () => {
      return {text: queryStr, values: []};
    }
  };
};
