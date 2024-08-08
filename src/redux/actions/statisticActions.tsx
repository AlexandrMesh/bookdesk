import React from 'react';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import DataService from '~http/services/books';
import i18n from '~translations/i18n';
import generateBarChartData from '~utils/generateBarChartData';
import DataPointLabel from '~screens/Statistic/DataPointLabel';
import colors from '~styles/colors';
import { IStat } from '~types/stat';
import { BookStatus } from '~types/books';

const PREFIX = 'STATISTIC';

export const setStat = createAction<IStat>(`${PREFIX}/setStat`);
export const triggerReloadStat = createAction(`${PREFIX}/triggerReloadStat`);

export const loadStat = createAsyncThunk(`${PREFIX}/loadStat`, async (boardType: BookStatus) => {
  const { language } = i18n;
  try {
    const { data } = (await DataService().getBooksCountByYear({ boardType, language })) || {};
    const chartData = generateBarChartData(data);
    return chartData;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
      averageReadingSpeed: 0,
      maxValue: 10,
    };
  }
});

export const loadUsersStat = createAsyncThunk(`${PREFIX}/loadUsersStat`, async (boardType: BookStatus) => {
  const { language } = i18n;
  const limit = 100;

  try {
    const { data } = (await DataService().getUsersCompletedBooksCount({ boardType, limit, language })) || {};
    const currentUserPlace = data?.currentUserPlace || '> 100';
    const chartData =
      data?.data.map(({ count }: { count: number }, index: number) => ({
        label: index + 1,
        value: count,
        frontColor: index + 1 === currentUserPlace ? colors.gold : colors.success,
        topLabelComponent: () => <DataPointLabel value={count} />,
      })) || [];
    return {
      data: chartData,
      currentUserPlace,
      maxValue: Math.max(...chartData.map(({ value }: { value: number }) => value)) + 10 || 200,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      currentUserPlace: 0,
      maxValue: 200,
    };
  }
});
