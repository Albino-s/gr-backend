import customNutritions from './customNutritions';
import dietitianCustomers from './dietitianCustomers';
import users from './users';

export const dietitianCustomersJoin = dietitianCustomers
  .leftJoin(users).on(dietitianCustomers.userId.equals(users.id))
  .leftJoin(customNutritions).on(dietitianCustomers.id.equals(customNutritions.customerId));

export const dietitianCustomersFields = [
  dietitianCustomers.star(),
  customNutritions.star(),
  dietitianCustomers.id.as('id'),
  dietitianCustomers.createdAt.as('createdAt'),
  customNutritions.id.as('customNutritionsId'),
  users.firstName.as('customerFirstName'),
  users.lastName.as('customerLastName'),
  users.email.as('customerEmail')
];

export default {
  select: (...additionalFields) => dietitianCustomers.select(
    ...dietitianCustomersFields,
    ...additionalFields
  ).from(dietitianCustomersJoin)
};
