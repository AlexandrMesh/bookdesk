import React, { useEffect, useState, useCallback } from 'react';
import { func, bool } from 'prop-types';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-gifted-charts';
import { useIsFocused } from '@react-navigation/native';
import { Spinner } from '~UI/Spinner';
import colors from '~styles/colors';
import styles from './styles';

const Statistic = ({ loadStat, shouldReloadStat }) => {
  const { t } = useTranslation(['statistic', 'common']);
  const [isLoading, setIsLoading] = useState(true);
  const [stat, setStat] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [averageReadingSpeed, setAverageReadingSpeed] = useState(0);

  const isFocused = useIsFocused();

  const fetchStat = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, totalCount, averageReadingSpeed } = await loadStat();
      console.log(data, 'data');
      setStat(data);
      setTotalCount(totalCount);
      setAverageReadingSpeed(averageReadingSpeed);
    } finally {
      setIsLoading(false);
    }
  }, [loadStat]);

  useEffect(() => {
    fetchStat();
  }, [fetchStat]);

  useEffect(() => {
    if (isFocused && shouldReloadStat) {
      fetchStat();
    }
  }, [isFocused, shouldReloadStat, fetchStat]);

  const barChartMaxWidth = 400;
  const maxValueToLimitBarChartMaxWidth = 6;

  if (stat && stat?.length === 0 && !isLoading) {
    return (
      <View style={styles.viewWrapper}>
        <Text style={styles.noDataLabel}>{t('noData')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {isLoading ? (
        <View style={styles.viewWrapper}>
          <Spinner />
        </View>
      ) : (
        <>
          <Text style={styles.title}>
            {t('completedBooks')} <Text style={styles.highlightedCount}>{t('common:count', { count: totalCount })}</Text>
          </Text>
          <BarChart
            barWidth={32}
            width={stat?.length <= maxValueToLimitBarChartMaxWidth ? barChartMaxWidth : undefined}
            noOfSections={3}
            scrollToEnd
            barBorderRadius={4}
            yAxisTextStyle={{ color: colors.neutral_light }}
            xAxisTextStyle={{ color: colors.neutral_light }}
            xAxisColor={colors.neutral_light}
            yAxisColor={colors.neutral_light}
            xAxisLabelTextStyle={{ color: colors.neutral_light }}
            data={stat}
          />
          <View style={styles.info}>
            <Text style={styles.label}>
              {t('averageReadingSpeed')} <Text style={styles.highlightedCount}>{t('common:count', { count: averageReadingSpeed })}</Text>
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

Statistic.propTypes = {
  loadStat: func.isRequired,
  shouldReloadStat: bool,
};

export default Statistic;
