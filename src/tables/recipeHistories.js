import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'recipeId',
  'userId',
  'recipe_servings',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'recipe_histories',
  columns
});

export const fields = functions.fields(objectFields);
