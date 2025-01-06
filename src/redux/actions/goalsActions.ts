import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import GoalsService from '~http/services/goals';
import { triggerReloadStat } from '~redux/actions/statisticActions';
import { AppThunkAPI } from '~redux/store/configureStore';

const PREFIX = 'GOALS';

export const setGoal = createAction<number>(`${PREFIX}/setGoal`);

export const deleteUserGoalItem = createAsyncThunk(`${PREFIX}/deleteUserGoalItem`, async (id: string, { dispatch }: AppThunkAPI) => {
  try {
    const { data } = await GoalsService().deleteUserGoalItem({ id });
    dispatch(triggerReloadStat());
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const addGoal = createAsyncThunk(`${PREFIX}/addGoal`, async (numberOfPages: string) => {
  const params = { numberOfPages };
  try {
    await GoalsService().addGoal({ ...params });
    return Number(numberOfPages);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const updateGoal = createAsyncThunk(`${PREFIX}/updateGoal`, async (numberOfPages: string) => {
  const params = { numberOfPages };
  try {
    await GoalsService().updateGoal({ ...params });
    return Number(numberOfPages);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const getGoalItems = createAsyncThunk(`${PREFIX}/getGoalItems`, async () => {
  try {
    const { data } = await GoalsService().getGoalItems();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const addGoalItem = createAsyncThunk(`${PREFIX}/addGoalItem`, async (pages: string | null, { dispatch }: AppThunkAPI) => {
  const params = { pages, added_at: new Date().getTime() };
  try {
    const { data } = await GoalsService().addGoalItem({ ...params });
    dispatch(triggerReloadStat());
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
