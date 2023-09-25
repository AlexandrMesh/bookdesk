import findIndex from 'ramda/src/findIndex';
import adjust from 'ramda/src/adjust';

/**
 * Takes a list and updates an entry that matches predicate function rule by merging passed object.
 * Returns new list.
 * If element was not found - list returned untouched
 *
 * e.g.:
 *   const list = [{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}];
 *   updateIn(list, listEl => listEl.b === 2, {a: 10, d: 100})
 *     => [{a: 1, b: 1}, {a: 10, b: 2, d: 100}, {a: 3, b: 3}]
 */
export default (list, predicate, object) => {
  const index = findIndex(predicate)(list);
  return index < 0 ? list : adjust(index, (element) => ({ ...element, ...object }), list);
};
