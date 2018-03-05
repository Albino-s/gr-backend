import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'name',
  'ingredientProduct',
  'unitProduct',
  'price',
  'size',
  'store',
  'is_organic',
  'is_deleted',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'products',
  columns
});

export const fields = functions.fields(objectFields);
