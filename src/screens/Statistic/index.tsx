import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-gifted-charts';
import { useIsFocused } from '@react-navigation/native';
import { Spinner } from '~UI/Spinner';
import { loadStat, loadUsersStat } from '~redux/actions/statisticActions';
import { getShouldReloadStat } from '~redux/selectors/statistic';
import { COMPLETED } from '~constants/boardType';
import { useAppDispatch, useAppSelector } from '~hooks';
import colors from '~styles/colors';
import styles from './styles';

const Statistic = () => {
  const { t } = useTranslation(['statistic', 'common']);
  const [isLoadingStat, setIsLoadingStat] = useState(true);
  const [isLoadingUsersStat, setIsLoadingUsersStat] = useState(true);
  const [stat, setStat] = useState([]);
  const [usersStat, setUsersStat] = useState([]);
  const [currentUserPlace, setCurrentUserPlace] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [averageReadingSpeed, setAverageReadingSpeed] = useState(0);
  const [maxValueForStat, setMaxValueForStat] = useState(10);
  const [maxValueForRating, setMaxValueForRating] = useState(200);

  const dispatch = useAppDispatch();
  const _loadStat = useCallback(() => dispatch(loadStat(COMPLETED)), [dispatch]);
  const _loadUsersStat = useCallback(() => dispatch(loadUsersStat(COMPLETED)), [dispatch]);

  const shouldReloadStat = useAppSelector(getShouldReloadStat);

  const isFocused = useIsFocused();

  const fetchStat = useCallback(async () => {
    setIsLoadingStat(true);
    try {
      const { data, totalCount, averageReadingSpeed, maxValue } = await _loadStat().unwrap();
      setStat(data as any);
      setTotalCount(totalCount);
      setAverageReadingSpeed(averageReadingSpeed);
      setMaxValueForStat(maxValue);
    } finally {
      setIsLoadingStat(false);
    }
  }, [_loadStat]);

  const fetchUsersStat = useCallback(async () => {
    setIsLoadingUsersStat(true);
    try {
      const { data, currentUserPlace, maxValue } = await _loadUsersStat().unwrap();
      setUsersStat(data);
      setCurrentUserPlace(currentUserPlace);
      setMaxValueForRating(maxValue);
    } finally {
      setIsLoadingUsersStat(false);
    }
  }, [_loadUsersStat]);

  useEffect(() => {
    fetchStat();
    fetchUsersStat();
  }, [fetchStat, fetchUsersStat]);

  useEffect(() => {
    if (isFocused && shouldReloadStat) {
      fetchStat();
      fetchUsersStat();
    }
  }, [isFocused, shouldReloadStat, fetchStat, fetchUsersStat]);

  const barChartMaxWidth = 400;
  const maxValueToLimitBarChartMaxWidth = 6;

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={styles.statBlock}>
          {isLoadingStat ? (
            <View style={styles.viewWrapper}>
              <Spinner />
            </View>
          ) : (
            <>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>
                  {t('completedBooks')} <Text style={styles.highlightedCount}>{t('common:count', { count: totalCount })}</Text>
                </Text>
              </View>
              <BarChart
                barWidth={32}
                width={stat?.length <= maxValueToLimitBarChartMaxWidth ? barChartMaxWidth : undefined}
                noOfSections={3}
                scrollToEnd
                maxValue={maxValueForStat}
                barBorderRadius={4}
                yAxisTextStyle={{ color: colors.neutral_light }}
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
        <View style={styles.statBlock}>
          {isLoadingUsersStat ? (
            <View style={styles.viewWrapper}>
              <Spinner />
            </View>
          ) : (
            <>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{t('topReaders')}</Text>
              </View>
              <BarChart
                barWidth={32}
                noOfSections={3}
                barBorderRadius={4}
                maxValue={maxValueForRating}
                width={usersStat?.length <= maxValueToLimitBarChartMaxWidth ? barChartMaxWidth : undefined}
                scrollToIndex={currentUserPlace - 1}
                yAxisTextStyle={{ color: colors.neutral_light }}
                xAxisColor={colors.neutral_light}
                yAxisColor={colors.neutral_light}
                xAxisLabelTextStyle={{ color: colors.neutral_light }}
                data={usersStat}
              />
              <View style={styles.info}>
                <Text style={styles.label}>
                  {t('placeInTheRating')} <Text style={styles.highlightedCount}>{currentUserPlace}</Text>
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistic;
