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

export const deriveSectionedPagesDone = createSelector([deriveSortedgetGoalsData], (pages) =>
  map(
    groupBy(
      (pages || []).map((item) => ({
        ...item,
        monthAndYear: new Date(item?.added_at)?.toLocaleString(i18n.language, { month: 'long', year: 'numeric' }),
      })),
      'monthAndYear',
    ),
    (value: any, key: string) => {
      return {
        title: key,
        count: sum(value.map(({ pages: pages1 }: { pages: number }) => Number(pages1))),
        data: map(
          groupBy(
            (value || []).map((item: { added_at: number }) => ({
              ...item,
              dayMonthAndYear: new Date(item?.added_at)?.toLocaleString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }),
            })),
            'dayMonthAndYear',
          ),
          (value2: any, key2: string) => {
            return {
              title: key2,
              count: sum(value2.map(({ pages: pages2 }: { pages: number }) => Number(pages2))),
              data: (value as any[]).sort((a, b) => b.added_at - a.added_at),
            };
          },
        ),
      };
    },
  ),
);
