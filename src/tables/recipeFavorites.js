import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'recipeId',
  'userId',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'recipe_favorites',
  columns
});

export const fields = functions.fields(objectFields);
