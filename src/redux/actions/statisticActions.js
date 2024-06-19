import DataService from '~http/services/books';
import i18n from '~translations/i18n';
import generateBarChartData from '~utils/generateBarChartData';

const PREFIX = 'STATISTIC';

export const SET_STAT = `${PREFIX}/SET_STAT`;
export const TRIGGER_RELOAD_STAT = `${PREFIX}/TRIGGER_RELOAD_STAT`;

export const setStat = (data) => ({
  type: SET_STAT,
  data,
});

export const triggerReloadStat = {
  type: TRIGGER_RELOAD_STAT,
};

export const loadStat = (boardType) => async (dispatch) => {
  const { language } = i18n;
  try {
    const { data } = (await DataService().getBooksCountByYear({ boardType, language })) || {};
    const chartData = generateBarChartData(data);
    dispatch(setStat(chartData));
    return chartData;
  } catch (e) {
    console.error(e);
    return [];
  }
};
