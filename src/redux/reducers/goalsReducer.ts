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
    .addCase(goalsActions.setGoalItems, (state, action) => {
      state.goal.data = action.payload;
    })
    .addCase(goalsActions.setGoal, (state, action) => {
      state.goal.numberOfPages = action.payload;
    });
});
