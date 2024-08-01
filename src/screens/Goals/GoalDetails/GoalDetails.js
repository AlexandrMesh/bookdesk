import React, { useState, useEffect, useCallback } from 'react';
import { arrayOf, shape, string, func, number } from 'prop-types';
import { ScrollView, View, Text, SectionList, FlatList, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getValidationFailure, validationTypes } from '~utils/validation';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { Spinner, Size } from '~UI/Spinner';
import { IDLE, PENDING, SUCCEEDED, FAILED } from '~constants/loadingStatuses';
import colors from '~styles/colors';
import ArrowDown from '~assets/arrow-down.svg';
import MedalIcon from '~assets/medal-star.svg';
import RemoveIcon from '~assets/remove.svg';
import ItemPlaceholder from './ItemPlaceholder';
import styles from './styles';

const GoalDetails = ({
  addGoalItem,
  sectionedPagesDone,
  goalNumberOfPages,
  numberOfPagesDoneToday,
  todayProgress,
  getGoalItems,
  deleteUserGoalItem,
}) => {
  const { i18n, t } = useTranslation(['goals', 'errors', 'common']);
  const [pages, setPages] = useState(null);
  const [errorForPage, setErrorForPages] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(IDLE);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGoalItemsId, setLoadingGoalItemsId] = useState(null);

  const { language } = i18n;

  const addExpandedItem = useCallback((item) => setExpandedItems([...expandedItems, item]), [expandedItems]);

  const removeExpandedItem = useCallback((item) => setExpandedItems(expandedItems.filter((expandedItem) => expandedItem !== item)), [expandedItems]);

  const toggleExpandedItem = useCallback(
    (item) => (expandedItems.includes(item) ? removeExpandedItem(item) : addExpandedItem(item)),
    [addExpandedItem, expandedItems, removeExpandedItem],
  );

  const validateForm = () => {
    const params = {
      lessComparedValue: 1,
      moreComparedValue: 1000,
    };
    const error = getValidationFailure(
      pages,
      [validationTypes.mustContainOnlyNumbers, validationTypes.isMoreThan, validationTypes.isLessThan],
      params,
    );
    return error ? t(`errors:${error}`, params) : null;
  };

  const handleAddGoalItem = async () => {
    try {
      setIsLoading(true);
      await addGoalItem(pages);
      setPages(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = () => {
    const error = validateForm();
    if (error) {
      setErrorForPages(error);
    } else {
      handleAddGoalItem();
    }
  };

  const handleChangePages = (value) => {
    setErrorForPages('');
    setPages(value);
  };

  const handleClearPages = () => {
    setErrorForPages('');
    setPages(null);
  };

  const handleDeleteGoalItem = useCallback(
    async (id) => {
      setLoadingGoalItemsId(id);
      try {
        await deleteUserGoalItem(id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingGoalItemsId(null);
      }
    },
    [deleteUserGoalItem],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingStatus(PENDING);
        await getGoalItems();
        setLoadingStatus(SUCCEEDED);
      } catch (error) {
        setLoadingStatus(FAILED);
        console.error(error);
      }
    };
    loadData();
  }, [getGoalItems, i18n.language]);

  const renderReadingHistoryItem = useCallback(
    (item) => (
      <Pressable
        style={[styles.readingHistory, expandedItems.includes(item.title) && styles.readingHistoryActive]}
        onPress={() => toggleExpandedItem(item.title)}
      >
        <View style={styles.titleColumn}>
          <ArrowDown style={[styles.arrowIcon, expandedItems.includes(item.title) ? null : styles.collapsedIcon]} width={16} height={16} />
          <Text style={styles.readingHistoryItem}>{item.title}</Text>
        </View>
        <View style={styles.countColumn}>
          {item.count >= goalNumberOfPages ? <MedalIcon style={styles.starIcon} width={24} height={24} fill={colors.gold} /> : null}
          <Text style={styles.countItem}>{t('common:count', { count: item.count })}</Text>
        </View>
      </Pressable>
    ),
    [expandedItems, goalNumberOfPages, t, toggleExpandedItem],
  );

  const getKeyExtractor = useCallback((item) => item._id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={[styles.readingHistory, styles.nested]}>
        <View style={styles.createdColumn}>
          <Text style={styles.readingHistoryItem}>
            {new Date(item.added_at).toLocaleString(language, {
              day: 'numeric',
              month: 'long',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.countColumn}>
          <Text style={styles.countItem}>{t('common:count', { count: item.pages })}</Text>
          <Pressable style={styles.removeIcon} onPress={() => !loadingGoalItemsId && handleDeleteGoalItem(item._id)}>
            {loadingGoalItemsId === item._id ? <Spinner size={Size.SMALL} /> : <RemoveIcon fill={colors.neutral_medium} width={20} height={20} />}
          </Pressable>
        </View>
      </View>
    ),
    [handleDeleteGoalItem, language, loadingGoalItemsId, t],
  );

  const renderReadingHistoryNestedItems = useCallback(
    (item) => <FlatList keyboardShouldPersistTaps='handled' data={item.data} renderItem={renderItem} keyExtractor={getKeyExtractor} />,
    [getKeyExtractor, renderItem],
  );

  const getProgressBarLabelColor = () => {
    if (todayProgress >= 100) {
      return colors.gold;
    }
    if (todayProgress >= 55) {
      return colors.primary_dark;
    }
    return colors.neutral_light;
  };

  const disabledControls = loadingStatus === IDLE || loadingStatus === PENDING || isLoading || !!loadingGoalItemsId;

  const emptyListComponent = useCallback(() => (loadingStatus === IDLE || loadingStatus === PENDING ? <ItemPlaceholder /> : null), [loadingStatus]);

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.stickyHeader}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>{section.title}</Text>
        </View>
        <View style={[styles.countColumn, styles.headerTitle]}>
          <Text style={styles.headerTitleText}>{t('common:count', { count: section.count })}</Text>
        </View>
      </View>
    ),
    [t],
  );

  const renderItemFFormSectionList = useCallback(
    ({ item }) => (
      <>
        {renderReadingHistoryItem(item)}
        {expandedItems.includes(item.title) && renderReadingHistoryNestedItems(item)}
      </>
    ),
    [expandedItems, renderReadingHistoryItem, renderReadingHistoryNestedItems],
  );

  const getKeyExtractorForSectionList = useCallback((item) => item.title, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView keyboardShouldPersistTaps='handled' style={styles.topBlock}>
          <View>
            <View style={styles.info}>
              <View style={styles.blockLeft}>
                <View>
                  <Text style={styles.infoText}>{t('goals:pagesDone')}</Text>
                </View>
                <View style={styles.goalWrapper}>
                  {todayProgress >= 100 && <MedalIcon style={styles.starIcon} width={24} height={24} fill={colors.gold} />}
                  <Text style={{ ...styles.blockText, color: todayProgress >= 100 ? colors.gold : colors.completed }}>{numberOfPagesDoneToday}</Text>
                </View>
              </View>

              <View style={styles.blockRight}>
                <View>
                  <Text style={styles.infoText}>{t('goals:goalInPages')}</Text>
                </View>
                <View style={styles.goalWrapper}>
                  <Text style={[styles.blockText, styles.goal]}>{goalNumberOfPages}</Text>
                </View>
              </View>
            </View>

            <View style={{ ...styles.progressBarWrapper, borderColor: todayProgress >= 100 ? colors.gold : colors.completed }}>
              <View
                style={{
                  ...styles.progressBar,
                  width: todayProgress > 100 ? '100%' : `${todayProgress}%`,
                  backgroundColor: todayProgress >= 100 ? 'transparent' : colors.completed,
                }}
              />
              <View style={styles.progressBarLabelWrapper}>
                <Text style={{ ...styles.progressBarLabel, color: getProgressBarLabelColor() }}>
                  {todayProgress >= 100 ? t('goals:goalAchieved') : `${todayProgress} %`}
                </Text>
              </View>
            </View>

            <Text style={styles.pagesCountDescription}>{t('goals:addedPageCountDescription')}</Text>
            <View style={styles.actionWrapper}>
              <Input
                wrapperClassName={styles.inputWrapper}
                errorWrapperClassName={styles.inputError}
                placeholder={t('goals:pagesCount')}
                disabled={disabledControls}
                error={errorForPage}
                onChangeText={handleChangePages}
                shouldDisplayClearButton={!!pages && !isLoading}
                onClear={handleClearPages}
                inputMode='numeric'
                value={pages}
              />
              <View>
                <Button
                  disabled={disabledControls}
                  iconPosition='right'
                  icon={isLoading && <Spinner size={Size.SMALL} />}
                  style={styles.button}
                  onPress={submitForm}
                  title={t('goals:add')}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.sectionedList}>
          {sectionedPagesDone.length > 0 ? <Text style={styles.title}>{t('goals:achievementsJournal')}</Text> : null}
          <SectionList
            sections={sectionedPagesDone}
            keyExtractor={getKeyExtractorForSectionList}
            ListEmptyComponent={emptyListComponent}
            renderItem={renderItemFFormSectionList}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled
          />
        </View>
      </View>
    </View>
  );
};

GoalDetails.propTypes = {
  addGoalItem: func.isRequired,
  sectionedPagesDone: arrayOf(
    shape({
      count: number,
      title: string,
      data: arrayOf(
        shape({
          count: number,
          title: string,
          data: arrayOf(shape({ added_at: number, dayMonthAndYear: string, monthAndYear: string, pages: number, _id: string })),
        }),
      ),
    }),
  ),
  goalNumberOfPages: number,
  numberOfPagesDoneToday: number,
  todayProgress: number,
  getGoalItems: func.isRequired,
  deleteUserGoalItem: func.isRequired,
};

export default GoalDetails;
