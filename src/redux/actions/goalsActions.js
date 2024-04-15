import AppService from '~http/services/app';
import i18n from '~translations/i18n';
import { RU } from '~constants/languages';

const PREFIX = 'GOALS';

export const ADD_GOAL_ITEM = `${PREFIX}/ADD_GOAL_ITEM`;

export const addGoalItem = (item) => ({
  type: ADD_GOAL_ITEM,
  item,
});
