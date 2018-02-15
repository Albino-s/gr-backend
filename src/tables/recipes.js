import sql from 'sql';
import * as functions from '../utils/functions';

const objectFields = [
  'name',
  'description',
  'photo',
  'difficulty',
  'rating',
  'prep_time',
  'cook_time',
  'servings',
  'instructions',
  'ingredient_count',
  'is_hidden',
  'is_deleted',
  'createdAt',
  'updatedAt'
];

const columns = [
  'id',
  ...objectFields
];

export default sql.define({
  name: 'recipes',
  columns
});

export const fields = functions.fields(objectFields);
