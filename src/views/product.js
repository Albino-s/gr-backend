const productView = (obj) => {
  obj.is_deleted = Boolean(obj.is_deleted);
  obj.is_organic = Boolean(obj.is_organic);
  return obj;
};

// :: Object -> Object

export default productView;
