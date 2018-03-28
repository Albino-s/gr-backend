const dietitianCustomerView = (obj) => {
  obj.is_confirmed = Boolean(obj.is_confirmed);
  return obj;
};

// :: Object -> Object
export default dietitianCustomerView;
