const recipeTagView = (obj) => {
  obj.is_deleted = Boolean(obj.is_deleted);
  return obj;
};

// :: Object -> Object

export default recipeTagView;
