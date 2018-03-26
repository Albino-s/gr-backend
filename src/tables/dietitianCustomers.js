import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'dietitianId',
  'userId',
  'is_confirmed',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'dietitian_customers',
  columns
});

export const fields = functions.fields(objectFields);
