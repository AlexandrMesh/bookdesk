import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sum from 'lodash/sum';
import i18n from '~translations/i18n';
import { RootState } from '~redux/store/configureStore';

type StateWithGoals = Pick<RootState, 'goals'>;

const getGoals = (state: StateWithGoals) => state.goals;

export const getGoal = (state: StateWithGoals) => getGoals(state).goal;

export const getGoalsData = (state: StateWithGoals) => getGoal(state).data;
export const getGoalNumberOfPages = (state: StateWithGoals) => getGoal(state).numberOfPages;

export const deriveNumberOfPagesDoneToday = createSelector([getGoalsData], (pages) =>
  // eslint-disable-next-line camelcase
  sum(pages.filter(({ added_at }) => new Date(added_at).toDateString() === new Date().toDateString()).map(({ pages }) => Number(pages))),
);

export const deriveTodayProgress = createSelector([getGoalNumberOfPages, deriveNumberOfPagesDoneToday], (goalNumberOfPages, numberOfPagesDoneToday) =>
  Math.round((numberOfPagesDoneToday / Number(goalNumberOfPages)) * 100),
);

export const deriveSortedgetGoalsData = createSelector([getGoalsData], (data) => [...data].sort((a, b) => b.added_at - a.added_at));

export const deriveSectionedPagesDone = createSelector([getGoalsData], (pages) =>
  map(
    groupBy(
      ([...pages] || [])
        .sort((a, b) => Number(b.added_at) - Number(a.added_at))
        .map((item) => ({
          ...item,
          monthAndYear: new Date(item?.added_at)?.toLocaleString(i18n.language, { month: 'long', year: 'numeric' }),
        })),
      'monthAndYear',
    ),
    (value, key) => {
      return {
        title: key,
        count: sum(value.map(({ pages }) => Number(pages))),
        data: map(
          groupBy(
            (value || []).map((item) => ({
              ...item,
              dayMonthAndYear: new Date(item?.added_at)?.toLocaleString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }),
            })),
            'dayMonthAndYear',
          ),
          (value, key) => {
            return {
              title: key,
              count: sum(value.map(({ pages }) => Number(pages))),
              data: value.sort((a, b) => Number(b.added_at) - Number(a.added_at)),
            };
          },
        ),
      };
    },
  ),
);
