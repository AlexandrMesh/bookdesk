import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import Button from '~UI/Button';
import { Spinner } from '~UI/Spinner';
import { getActiveModal } from '~redux/selectors/books';
import {
  clearDataForChangeLanguage,
  hideModal,
  triggerReloadBookList,
  loadCategories,
  clearSearchResults,
  clearAllFilters,
} from '~redux/actions/booksActions';
import { clearAddCustomBookState } from '~redux/actions/customBookActions';
import { triggerReloadStat } from '~redux/actions/statisticActions';
import { LANGUAGE_SETTINGS } from '~constants/modalTypes';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import SlideMenu from '~UI/SlideMenu';
import { RU, EN } from '~constants/languages';
import { useAppDispatch, useAppSelector } from '~hooks';
import BookStatusItem from './LanguageItem';
import styles from './styles';

const LanguageSettings = () => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const [tempLanguageValue, setTempLanguageValue] = useState('');
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  const [isLoading, seIstLoading] = useState(false);

  const { language } = i18n;

  const dispatch = useAppDispatch();
  const _hideModal = () => dispatch(hideModal());
  const triggerReloadData = async () => {
    dispatch(clearDataForChangeLanguage());
    dispatch(clearAllFilters(ALL));
    dispatch(clearAddCustomBookState());
    await dispatch(loadCategories(true));
    dispatch(triggerReloadBookList(ALL));
    dispatch(triggerReloadBookList(PLANNED));
    dispatch(triggerReloadBookList(IN_PROGRESS));
    dispatch(triggerReloadBookList(COMPLETED));
    dispatch(triggerReloadStat());
    dispatch(clearSearchResults());
  };

  const isVisible = useAppSelector(getActiveModal) === LANGUAGE_SETTINGS;

  useEffect(() => {
    if (isVisible) {
      setTempLanguageValue(language as any);
    }
  }, [language, isVisible]);

  const handleUpdate = async () => {
    seIstLoading(true);
    i18n.changeLanguage(tempLanguageValue);
    try {
      await AsyncStorage.setItem('language', tempLanguageValue);
      await triggerReloadData();
      setShouldAutoClose(true);
    } finally {
      seIstLoading(false);
    }
  };

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

  const actionTypes = [
    { title: t(RU), isSelected: tempLanguageValue === RU, action: async () => setTempLanguageValue(RU) },
    { title: t(EN), isSelected: tempLanguageValue === EN, action: () => setTempLanguageValue(EN) },
  ];

  const renderItem = useCallback(({ item }: any) => <BookStatusItem title={item.title} isSelected={item.isSelected} action={item.action} />, []);

  const getKeyExtractor = useCallback(({ title }: any) => title, []);

  return isVisible ? (
    <SlideMenu isVisible={isVisible} title={t('appLanguage')} shouldAutoClose={shouldAutoClose} onClose={_hideModal} onReset={() => undefined}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <FlashList data={actionTypes} estimatedItemSize={40} renderItem={renderItem} keyExtractor={getKeyExtractor} />
          <View style={styles.submitButtonWrapper}>
            <Button style={styles.submitButton} title={t('common:save')} onPress={handleUpdate} />
          </View>
        </>
      )}
    </SlideMenu>
  ) : null;
};

export default LanguageSettings;
