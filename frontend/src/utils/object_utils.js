export const safeGet = (obj, key, defaultValue=undefined) => {
  return key.split('.').reduce((nestedObject, key) => {
    if(nestedObject && key in nestedObject) {
      return nestedObject[key];
    }
    return defaultValue;
  }, obj);
};


export const flatten = (objectOrArray, prefix = '', formatter = (k) => (k)) => {
  const nestedFormatter = (k) => ('.' + k);
  const nestElement = (prev, value, key) => (
    (value && typeof value === 'object')
      ? { ...prev, ...flatten(value, `${prefix}${formatter(key)}`, nestedFormatter) }
      : { ...prev, ...{ [`${prefix}${formatter(key)}`]: value } });

  return Array.isArray(objectOrArray)
    ? objectOrArray.reduce(nestElement, {})
    : Object.keys(objectOrArray).reduce(
      (prev, element) => nestElement(prev, objectOrArray[element], element),
      {},
    );
};
