import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'name',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'product_categories',
  columns
});

export const fields = functions.fields(objectFields);
