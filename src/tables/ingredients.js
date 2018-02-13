import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'unitIngredient',
  'categoryIngredient',
  'name_singular',
  'name_plural',
  'photo',
  'calories',
  'total_carbohydrates',
  'sugar',
  'fat_calories',
  'total_fat',
  'saturated_fat',
  'trans_fat',
  'cholesterol',
  'sodium',
  'total_carbs',
  'dietary_fiber',
  'total_sugar',
  'added_sugar',
  'protein',
  'potassium',
  'vitamin_a',
  'vitamin_c',
  'calcium',
  'iron',
  'is_deleted',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'ingredients',
  columns
});

export const fields = functions.fields(objectFields);
