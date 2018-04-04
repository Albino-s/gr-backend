import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'customerId',
  'calories',
  'calories_from_fat',
  'total_fat',
  'saturated_fat',
  'trans_fat',
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
  'cholesterol',
  'createdAt',
  'updatedAt',
  'breakfastGoal',
  'lunchGoal',
  'dinnerGoal',
  'snacksGoal',
  'gender',
  'height',
  'weight'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'custom_nutritions',
  columns
});

export const fields = functions.fields(objectFields);
