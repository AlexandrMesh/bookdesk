// Create a reducer from an object map of action types
// Example usage:
// const defaultState = {};
// const reducer = createReducer(defaultState, (state, action) => ({
//   [MY_ACTION]: () => ({
//     ...state
//   })
// }));
export default (defaultState, reducer) =>
  (state = defaultState, action) => {
    const actionHandler = reducer(state, action)[action.type];
    return actionHandler ? actionHandler() : state;
  };
