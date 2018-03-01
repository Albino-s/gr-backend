import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'name',
  'type',
  'is_deleted',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'tags',
  columns
});

export const fields = functions.fields(objectFields);
