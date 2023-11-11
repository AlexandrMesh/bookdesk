import React, { useState, useEffect } from 'react';
import { bool, func } from 'prop-types';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import Button from '~UI/Button';
import { Spinner } from '~UI/Spinner';
import SlideMenu from '~UI/SlideMenu';
import { RU, EN } from '~constants/languages';
import BookStatusItem from './LanguageItem';
import styles from './styles';

const LanguageSettings = ({ isVisible, hideModal, triggerReloadData }) => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const [tempLanguageValue, setTempLanguageValue] = useState(null);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  const [isLoading, seIstLoading] = useState(false);

  const { language } = i18n;

  useEffect(() => {
    if (isVisible) {
      setTempLanguageValue(language);
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

  return (
    <SlideMenu isVisible={isVisible} title={t('appLanguage')} shouldAutoClose={shouldAutoClose} onClose={hideModal} onReset={() => undefined}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <FlashList
            data={actionTypes}
            estimatedItemSize={actionTypes.length}
            renderItem={({ item }) => <BookStatusItem title={item.title} isSelected={item.isSelected} action={item.action} />}
            keyExtractor={({ title }) => title}
          />
          <View style={styles.submitButtonWrapper}>
            <Button style={styles.submitButton} title={t('common:save')} onPress={handleUpdate} />
          </View>
        </>
      )}
    </SlideMenu>
  );
};

LanguageSettings.propTypes = {
  triggerReloadData: func.isRequired,
  hideModal: func.isRequired,
  isVisible: bool,
};

export default LanguageSettings;
