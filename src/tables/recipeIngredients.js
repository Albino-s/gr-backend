import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'recipeId',
  'ingredientId',
  'unit_us',
  'quantity_us',
  'unit_eu',
  'quantity_eu',
  'notes',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'recipe_ingredients',
  columns
});

export const fields = functions.fields(objectFields);
