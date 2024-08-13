import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import GoalsService from '~http/services/goals';

const PREFIX = 'GOALS';

export const setGoal = createAction<number>(`${PREFIX}/setGoal`);

export const deleteUserGoalItem = createAsyncThunk(`${PREFIX}/deleteUserGoalItem`, async (id: string) => {
  try {
    const { data } = await GoalsService().deleteUserGoalItem({ id });
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

export const addGoalItem = createAsyncThunk(`${PREFIX}/addGoalItem`, async (pages: string | null) => {
  const params = { pages, added_at: new Date().getTime() };
  try {
    const { data } = await GoalsService().addGoalItem({ ...params });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
