import customNutritions from './customNutritions';
import dietitianCustomers from './dietitianCustomers';
import users from './users';

export const dietitianCustomersJoin = dietitianCustomers
  .leftJoin(users).on(dietitianCustomers.dietitianId.equals(users.id))
  .leftJoin(customNutritions).on(dietitianCustomers.id.equals(customNutritions.customerId));

export const dietitianCustomersFields = [
  dietitianCustomers.star(),
  customNutritions.star(),
  dietitianCustomers.id.as('id'),
  users.firstName.as('dietitianFirstName'),
  users.lastName.as('dietitianLastName')
];

export default {
  select: (...additionalFields) => dietitianCustomers.select(
    ...dietitianCustomersFields,
    ...additionalFields
  ).from(dietitianCustomersJoin)
};
