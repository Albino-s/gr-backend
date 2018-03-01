import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'recipeId',
  'tagId',
  'is_deleted',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'recipe_tags',
  columns
});

export const fields = functions.fields(objectFields);
