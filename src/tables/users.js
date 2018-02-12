import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'email',
  'firstName',
  'lastName',
  'avatar',
  'createdAt',
  'updatedAt',
  'is_admin',
  'servings',
  'password',
  'resetToken'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'users',
  columns
});

export const fields = functions.fields(objectFields);
