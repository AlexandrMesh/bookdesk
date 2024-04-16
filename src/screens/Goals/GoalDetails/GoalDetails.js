import React, { useState } from 'react';
import { View, Text, SectionList, FlatList, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '~translations/i18n';
import { getValidationFailure, validationTypes } from '~utils/validation';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import colors from '~styles/colors';
import ArrowDown from '~assets/arrow-down.svg';
import MedalIcon from '~assets/medal-star.svg';
import styles from './styles';

const Goals = ({ addGoalItem, goalsData, sectionedPagesDone, goalNumberOfPages, numberOfPagesDoneToday, todayProgress, showEditGoalModal }) => {
  const { t } = useTranslation(['goals', 'errors', 'common']);
  const [pages, setPages] = useState(null);
  const [errorForPage, setErrorForPages] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);

  const addExpandedItem = (item) => setExpandedItems([...expandedItems, item]);

  const removeExpandedItem = (item) => setExpandedItems(expandedItems.filter((expandedItem) => expandedItem !== item));

  const toggleExpandedItem = (item) => (expandedItems.includes(item) ? removeExpandedItem(item) : addExpandedItem(item));

  const validateForm = () => {
    const params = {
      lessComparedValue: 5,
      moreComparedValue: 1000,
    };
    const error = getValidationFailure(
      pages,
      [validationTypes.mustContainOnlyNumbers, validationTypes.isMoreThan, validationTypes.isLessThan],
      params,
    );
    return error ? t(`errors:${error}`, params) : null;
  };

  const submitForm = () => {
    const error = validateForm();
    if (error) {
      setErrorForPages(error);
    } else {
      console.log('submit');
      addGoalItem({ id: Math.random(), pages, added_at: new Date().getTime() });
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

  const renderReadingHistoryItem = (item) => (
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
  );

  const renderReadingHistoryNestedItems = (item) => (
    <FlatList
      keyboardShouldPersistTaps='handled'
      data={item.data}
      renderItem={({ item }) => (
        <View style={[styles.readingHistory, styles.nested]}>
          <View style={styles.createdColumn}>
            <Text style={styles.readingHistoryItem}>
              {new Date(item.added_at).toLocaleString(i18n.language, {
                day: 'numeric',
                month: 'long',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.countColumn}>
            <Text style={styles.countItem}>{t('common:count', { count: item.pages })}</Text>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topBlock}>
          <View style={styles.info}>
            <View style={styles.blockLeft}>
              <View>
                <Text style={styles.infoText}>Прочитано (страниц)</Text>
              </View>
              <Text style={{ ...styles.blockText, color: todayProgress >= 100 ? colors.gold : colors.completed }}>{numberOfPagesDoneToday}</Text>
            </View>

            <View style={styles.blockRight}>
              <View>
                <Text style={styles.infoText}>Цель (страниц)</Text>
              </View>
              <View style={styles.goalWrapper}>
                <MedalIcon style={styles.starIcon} width={24} height={24} fill={colors.gold} />
                <Pressable onPress={showEditGoalModal}>
                  <Text style={[styles.blockText, styles.goal]}>{goalNumberOfPages}</Text>
                </Pressable>
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
              <Text style={{ ...styles.progressBarLabel, color: todayProgress >= 100 ? colors.gold : colors.neutral_light }}>
                {todayProgress >= 100 ? 'Цель достигнута!' : `${todayProgress} %`}
              </Text>
            </View>
          </View>

          <View style={styles.actionWrapper}>
            <Input
              wrapperClassName={styles.inputWrapper}
              errorWrapperClassName={styles.inputError}
              placeholder={t('enterPagesCount')}
              error={errorForPage}
              onChangeText={handleChangePages}
              shouldDisplayClearButton={!!pages}
              onClear={handleClearPages}
              inputMode='numeric'
              value={pages}
            />
            <View style={styles.buttons}>
              <Button style={styles.button} onPress={submitForm} title={t('add')} />
            </View>
          </View>
        </View>

        {goalsData.length > 0 && (
          <View style={styles.sectionedList}>
            <Text style={styles.title}>Журнал достижений</Text>
            <SectionList
              initialNumToRender={10}
              sections={sectionedPagesDone}
              renderItem={({ item }) => (
                <>
                  {renderReadingHistoryItem(item)}
                  {expandedItems.includes(item.title) && renderReadingHistoryNestedItems(item)}
                </>
              )}
              renderSectionHeader={({ section }) => (
                <View style={styles.stickyHeader}>
                  <View style={styles.headerTitle}>
                    <Text style={styles.headerTitleText}>{section.title}</Text>
                  </View>
                  <View style={[styles.countColumn, styles.headerTitle]}>
                    <Text style={styles.headerTitleText}>{t('common:count', { count: section.count })}</Text>
                  </View>
                </View>
              )}
              stickySectionHeadersEnabled
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Goals;
