import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sum from 'lodash/sum';
import i18n from '~translations/i18n';

const getGoals = (state) => state.goals;

export const getGoal = (state) => getGoals(state).goal;

export const getGoalsData = (state) => getGoal(state).data;
export const getGoalNumberOfPages = (state) => getGoal(state).numberOfPages;

export const deriveNumberOfPagesDoneToday = createSelector([getGoalsData], (pages) =>
  sum(pages.filter(({ added_at }) => new Date(added_at).toDateString() === new Date().toDateString()).map(({ pages }) => Number(pages))),
);

export const deriveTodayProgress = createSelector([getGoalNumberOfPages, deriveNumberOfPagesDoneToday], (goalNumberOfPages, numberOfPagesDoneToday) =>
  Math.round((numberOfPagesDoneToday / goalNumberOfPages) * 100),
);

export const deriveSectionedPagesDone = createSelector([getGoalsData], (pages) =>
  map(
    groupBy(
      (pages || [])
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
