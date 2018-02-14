import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'userId',
  'productId',
  'unit_us',
  'quantity_us',
  'unit_eu',
  'quantity_eu',
  'is_deleted',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'pantries',
  columns
});

export const fields = functions.fields(objectFields);
