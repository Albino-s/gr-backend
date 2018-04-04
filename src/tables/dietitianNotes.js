import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'dietitianId',
  'userId',
  'note',
  'date',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'dietitian_notes',
  columns
});

export const fields = functions.fields(objectFields);
