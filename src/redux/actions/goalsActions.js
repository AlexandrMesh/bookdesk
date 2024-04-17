import GoalsService from '~http/services/goals';

const PREFIX = 'GOALS';

export const ADD_GOAL_ITEM = `${PREFIX}/ADD_GOAL_ITEM`;
export const SET_GOAL = `${PREFIX}/SET_GOAL`;
export const SET_GOAL_ITEMS = `${PREFIX}/SET_GOAL_ITEMS`;

export const addGoalItemAction = (item) => ({
  type: ADD_GOAL_ITEM,
  item,
});

export const setGoal = (numberOfPages) => ({
  type: SET_GOAL,
  numberOfPages,
});

export const setGoalItems = (items) => ({
  type: SET_GOAL_ITEMS,
  items,
});

export const addGoal = (numberOfPages) => async (dispatch) => {
  const params = { numberOfPages };
  try {
    await GoalsService().addGoal({ ...params });
    dispatch(setGoal(Number(numberOfPages)));
  } catch (error) {
    console.error(error);
  }
};

export const updateGoal = (numberOfPages) => async (dispatch) => {
  const params = { numberOfPages };
  try {
    await GoalsService().updateGoal({ ...params });
    dispatch(setGoal(Number(numberOfPages)));
  } catch (error) {
    console.error(error);
  }
};

export const getGoalItems = () => async (dispatch) => {
  try {
    const { data } = await GoalsService().getGoalItems();
    dispatch(setGoalItems(data));
  } catch (error) {
    console.error(error);
  }
};

export const addGoalItem = (pages) => async (dispatch) => {
  const params = { pages, added_at: new Date().getTime() };
  try {
    const { data } = await GoalsService().addGoalItem({ ...params });
    dispatch(setGoalItems(data));
  } catch (error) {
    console.error(error);
  }
};
