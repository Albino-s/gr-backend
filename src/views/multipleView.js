const multipleView = (data, metadata) => {
  return {totalRows: metadata.totalRows, data};
};

// :: Object -> Object

export default multipleView;
