import recipeTags from './recipeTags';
import tags from './tags';

export const recipeTagsJoin = recipeTags
  .leftJoin(tags).on(recipeTags.tagId.equals(tags.id));

export const recipeTagsFields = [
  recipeTags.star(),
  tags.name.as('name'),
  tags.type.as('type')
];

export default {
  select: (...additionalFields) => recipeTags.select(
    ...recipeTagsFields,
    ...additionalFields
  ).from(recipeTagsJoin)
};
