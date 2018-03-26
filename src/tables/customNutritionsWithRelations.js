import customNutritions from './customNutritions';
import dietitianCustomers from './dietitianCustomers';

export const customNutritionsJoin = customNutritions
  .leftJoin(dietitianCustomers).on(customNutritions.customerId.equals(dietitianCustomers.id));

export const customNutritionsFields = [
  customNutritions.star(),
  dietitianCustomers.userId.as('userId'),
  dietitianCustomers.dietitianId.as('dietitianId')
];

export default {
  select: (...additionalFields) => customNutritions.select(
    ...customNutritionsFields,
    ...additionalFields
  ).from(customNutritionsJoin)
};
