export const safeGet = (obj, key, defaultValue = undefined) => key.split('.').reduce((nestedObject, innerKey) => {
  console.log('call safeGet');
  if (nestedObject && innerKey in nestedObject) {
    return nestedObject[innerKey];
  }
  return defaultValue;
}, obj);


export const flatten = (objectOrArray, prefix = '', formatter = k => (k)) => {
  const nestedFormatter = k => (`.${k}`);
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
