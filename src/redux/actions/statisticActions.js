import React from 'react';
import DataService from '~http/services/books';
import i18n from '~translations/i18n';
import generateBarChartData from '~utils/generateBarChartData';
import DataPointLabel from '~screens/Statistic/DataPointLabel';
import colors from '~styles/colors';

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
    return {
      data: [],
      totalCount: 0,
      averageReadingSpeed: 0,
      maxValue: 10,
    };
  }
};

export const loadUsersStat = (boardType) => async (dispatch) => {
  const { language } = i18n;
  const limit = 100;
  try {
    const { data } = (await DataService().getUsersCompletedBooksCount({ boardType, limit, language })) || {};
    const currentUserPlace = data?.currentUserPlace || '> 100';
    const chartData =
      data?.data.map(({ count }, index) => ({
        label: index + 1,
        value: count,
        frontColor: index + 1 === currentUserPlace ? colors.gold : colors.success,
        topLabelComponent: () => <DataPointLabel value={count} />,
      })) || [];
    return {
      data: chartData,
      currentUserPlace,
      maxValue: Math.max(...chartData.map(({ value }) => value)) + 10 || 200,
    };
  } catch (e) {
    return {
      data: [],
      currentUserPlace: 0,
      maxValue: 200,
    };
  }
};
