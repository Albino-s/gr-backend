/* eslint camelcase: 0 */
const userView = (obj) => {
  delete obj.password;
  delete obj.resetToken;
  obj.is_admin = Boolean(obj.is_admin);
  return obj;
};

// :: Object -> Object

export default userView;
