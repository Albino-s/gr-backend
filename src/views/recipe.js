const recipeView = (obj) => {
  obj.is_deleted = Boolean(obj.is_deleted);
  obj.is_hidden = Boolean(obj.is_hidden);
  return obj;
};

// :: Object -> Object

export default recipeView;
