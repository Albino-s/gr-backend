import recipeIngredients from './recipeIngredients';
import ingredients from './ingredients';
import usaStandartUnits from './usaStandartUnits';
import euStandartUnits from './euStandartUnits';

export const recipeIngredientsJoin = recipeIngredients
  .leftJoin(ingredients).on(recipeIngredients.ingredientId.equals(ingredients.id))
  .leftJoin(usaStandartUnits).on(recipeIngredients.unit_us.equals(usaStandartUnits.id))
  .leftJoin(euStandartUnits).on(recipeIngredients.unit_eu.equals(euStandartUnits.id));

export const recipeIngredientsFields = [
  recipeIngredients.star(),
  ingredients.name_plural.as('name_plural'),
  ingredients.name_singular.as('name_singular'),
  usaStandartUnits.short_name_plural.as('us_short_name_plural'),
  usaStandartUnits.full_name.as('us_full_name'),
  usaStandartUnits.name_plural.as('us_name_plural'),
  usaStandartUnits.name.as('us_name'),
  euStandartUnits.short_name_plural.as('eu_short_name_plural'),
  euStandartUnits.full_name.as('eu_full_name'),
  euStandartUnits.name_plural.as('eu_name_plural'),
  euStandartUnits.name.as('eu_name')
];

export default {
  select: (...additionalFields) => recipeIngredients.select(
    ...recipeIngredientsFields,
    ...additionalFields
  ).from(recipeIngredientsJoin)
};
