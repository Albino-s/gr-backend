import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'recipeId',
  'calories',
  'calories_from_fat',
  'total_fat',
  'saturated_fat',
  'trans_fat',
  'cholesterol',
  'sodium',
  'potassium',
  'total_carbohydrates',
  'dietary_fiber',
  'sugar',
  'protein',
  'vitamin_a',
  'vitamin_c',
  'calcium',
  'iron',
  'servings',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'recipe_nutritions',
  columns
});

export const fields = functions.fields(objectFields);
