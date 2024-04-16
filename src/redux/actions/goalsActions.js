import GoalsService from '~http/services/goals';

const PREFIX = 'GOALS';

export const ADD_GOAL_ITEM = `${PREFIX}/ADD_GOAL_ITEM`;
export const GOAL_ADDED = `${PREFIX}/GOAL_ADDED`;

export const addGoalItem = (item) => ({
  type: ADD_GOAL_ITEM,
  item,
});

export const goalAdded = (numberOfPages) => ({
  type: GOAL_ADDED,
  numberOfPages,
});

export const addGoal = (numberOfPages) => async (dispatch) => {
  const params = { numberOfPages };
  try {
    await GoalsService().addGoal({ ...params });
    dispatch(goalAdded(numberOfPages));
  } catch (error) {
    console.error(error);
  }
};
