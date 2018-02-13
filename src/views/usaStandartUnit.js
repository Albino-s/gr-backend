const usaStandartUnitView = (obj) => {
  obj.is_main = Boolean(obj.is_main);
  return obj;
};

// :: Object -> Object

export default usaStandartUnitView;
