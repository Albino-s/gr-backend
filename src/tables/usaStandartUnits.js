import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'name',
  'full_name',
  'name_plural',
  'short_name_plural',
  'createdAt',
  'updatedAt',
  'is_main'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'usa_standart_units',
  columns
});

export const fields = functions.fields(objectFields);
