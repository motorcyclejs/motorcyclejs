const is = {
  array: Array.isArray,
  primitive(x: any) {
    return typeof x === 'string' || typeof x === 'number';
  },
};

export default is;
