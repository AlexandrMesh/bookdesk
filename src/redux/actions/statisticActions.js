import DataService from '~http/services/books';
import i18n from '~translations/i18n';
import { deriveStat } from '~redux/selectors/statistic';

const PREFIX = 'STATISTIC';

export const SET_STAT = `${PREFIX}/SET_STAT`;

export const setStat = (data) => ({
  type: SET_STAT,
  data,
});

export const loadStat = (boardType) => async (dispatch) => {
  const { language } = i18n;
  try {
    const { data } = (await DataService().getBooksCountByYear({ boardType, language })) || {};
    dispatch(setStat(data));
    return deriveStat(data);
  } catch (e) {
    console.error(e);
  }
};
