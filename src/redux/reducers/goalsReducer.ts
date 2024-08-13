import { createReducer } from '@reduxjs/toolkit';
import * as goalsActions from '~redux/actions/goalsActions';
import { IGoal } from '~types/goals';

export interface IGoalState {
  numberOfPages: number | null;
  data: IGoal[];
}

const getDefaultGoalState = (): IGoalState => ({
  numberOfPages: null,
  data: [],
});

export interface IDefaultState {
  goal: IGoalState;
}

const getDefaultState = (): IDefaultState => ({
  goal: getDefaultGoalState(),
});

const defaultState = getDefaultState();

export default createReducer(defaultState, (builder) => {
  builder
    .addCase(goalsActions.deleteUserGoalItem.fulfilled, (state, action) => {
      state.goal.data = action.payload;
    })
    .addCase(goalsActions.addGoal.fulfilled, (state, action) => {
      state.goal.numberOfPages = action.payload;
    })
    .addCase(goalsActions.updateGoal.fulfilled, (state, action) => {
      state.goal.numberOfPages = action.payload;
    })
    .addCase(goalsActions.getGoalItems.fulfilled, (state, action) => {
      state.goal.data = action.payload;
    })
    .addCase(goalsActions.addGoalItem.fulfilled, (state, action) => {
      state.goal.data = action.payload;
    })
    .addCase(goalsActions.setGoal, (state, action) => {
      state.goal.numberOfPages = action.payload;
    });
});
