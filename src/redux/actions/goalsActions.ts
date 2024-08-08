import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import GoalsService from '~http/services/goals';
import { AppThunkAPI } from '~redux/store/configureStore';
import { IGoal } from '~types/goals';

const PREFIX = 'GOALS';

export const setGoal = createAction<number>(`${PREFIX}/setGoal`);
export const setGoalItems = createAction<IGoal[]>(`${PREFIX}/setGoalItems`);

export const deleteUserGoalItem = createAsyncThunk(`${PREFIX}/deleteUserGoalItem`, async (id: string, { dispatch }: AppThunkAPI) => {
  try {
    const { data } = await GoalsService().deleteUserGoalItem({ id });
    dispatch(setGoalItems(data));
  } catch (e) {
    console.error(e);
  }
});

export const addGoal = createAsyncThunk(`${PREFIX}/addGoal`, async (numberOfPages: string, { dispatch }: AppThunkAPI) => {
  const params = { numberOfPages };
  try {
    await GoalsService().addGoal({ ...params });
    dispatch(setGoal(Number(numberOfPages)));
  } catch (error) {
    console.error(error);
  }
});

export const updateGoal = createAsyncThunk(`${PREFIX}/updateGoal`, async (numberOfPages: string, { dispatch }: AppThunkAPI) => {
  const params = { numberOfPages };
  try {
    await GoalsService().updateGoal({ ...params });
    dispatch(setGoal(Number(numberOfPages)));
  } catch (error) {
    console.error(error);
  }
});

export const getGoalItems = createAsyncThunk(`${PREFIX}/getGoalItems`, async (_, { dispatch }: AppThunkAPI) => {
  try {
    const { data } = await GoalsService().getGoalItems();
    dispatch(setGoalItems(data));
  } catch (error) {
    console.error(error);
  }
});

export const addGoalItem = createAsyncThunk(`${PREFIX}/addGoalItem`, async (pages: string | null, { dispatch }: AppThunkAPI) => {
  const params = { pages, added_at: new Date().getTime() };
  try {
    const { data } = await GoalsService().addGoalItem({ ...params });
    dispatch(setGoalItems(data));
  } catch (error) {
    console.error(error);
  }
});
