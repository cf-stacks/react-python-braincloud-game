export const safeGet = (obj, key) => {
  return key.split('.').reduce((nestedObject, key) => {
    if(nestedObject && key in nestedObject) {
      return nestedObject[key];
    }
    return undefined;
  }, obj);
};
