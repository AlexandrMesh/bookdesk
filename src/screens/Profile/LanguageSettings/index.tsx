import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { clearDataForChangeLanguage, triggerReloadBookList, loadCategories, clearSearchResults, clearAllFilters } from '~redux/actions/booksActions';
import { clearAddCustomBookState } from '~redux/actions/customBookActions';
import { triggerReloadStat } from '~redux/actions/statisticActions';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { RU, EN } from '~constants/languages';
import Dropdown from '~UI/Dropdown';
import { useAppDispatch } from '~hooks';

const LanguageSettings = () => {
  const { t, i18n } = useTranslation('app');
  const [isLoading, seIstLoading] = useState(false);

  const { language } = i18n;

  const dispatch = useAppDispatch();
  const triggerReloadData = useCallback(async () => {
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
  }, [dispatch]);

  const handleUpdate = async (value: string) => {
    if (isLoading || language === value) {
      return;
    }
    seIstLoading(true);
    i18n.changeLanguage(value);
    try {
      await AsyncStorage.setItem('language', value);
      await triggerReloadData();
    } finally {
      seIstLoading(false);
    }
  };

  const actionTypes = [
    { title: t(RU), value: RU },
    { title: t(EN), value: EN },
  ];

  return <Dropdown items={actionTypes} isLoading={isLoading} selectedItem={language} buttonLabel={t(language)} onChange={handleUpdate} />;
};

export default LanguageSettings;
