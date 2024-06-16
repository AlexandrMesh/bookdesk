import React from 'react';
import range from 'lodash/range';
import { getT } from '~translations/i18n';
import { MAPPED_MONTHS } from '~constants/statistic';
import DataPointLabel from '~screens/Statistic/DataPointLabel';

const getStatistic = (state) => state.statistic;

export const getStat = (state) => getStatistic(state).stat;

// refactor - transfer to utils
export const deriveStat = (stat) => {
  const years = stat.map(({ year }) => year);
  const min = Math.min(...years);
  const max = Math.max(...years);
  const yearsArray = range(min, max + 1);
  const arrayWithMonth = yearsArray.map((item) => ({ year: item, months: range(1, 13).map((item) => ({ month: item, value: 0 })) }));
  const result = arrayWithMonth.map((item) => {
    const findByYears = stat.filter((statItem) => statItem.year === item.year);
    const montshArray = item.months.map((item) => {
      const value = findByYears.find(({ month }) => month === item.month)?.count || 0;
      return {
        label: getT('statistic')(MAPPED_MONTHS[item.month]),
        value,
        dataPointLabelComponent: () => <DataPointLabel value={value} />,
      };
    });
    const yearValue = montshArray[0].value;
    return [
      {
        label: item.year,
        labelTextStyle: { color: '#d4af37', fontSize: 15 },
        value: yearValue,
        dataPointLabelComponent: () => <DataPointLabel value={yearValue} />,
      },
      ...montshArray,
    ];
  });
  return {
    data: result.flat(),
    maxValue: Math.max(...result.flat().map(({ value }) => value)) + 10,
  };
};
