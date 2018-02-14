import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'pantryId',
  'unit_us',
  'quantity_us',
  'action',
  'is_deleted',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'pantry_transactions',
  columns
});

export const fields = functions.fields(objectFields);
