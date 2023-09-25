import zipObject from 'lodash/zipObject';

export default (list) => zipObject(list, list);
