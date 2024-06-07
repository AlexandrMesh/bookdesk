import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, Linking } from 'react-native';
import Button from '~UI/Button';
import styles from './styles';

const UpdateApp = () => {
  const { t } = useTranslation(['app', 'common']);
  const [googlePlayUrl, setGooglePlayUrl] = useState('');

  const getGooglePlayUrl = async () => {
    const googlePlayUrl = await AsyncStorage.getItem('googlePlayUrl');
    setGooglePlayUrl(googlePlayUrl);
  };

  useEffect(() => {
    getGooglePlayUrl();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>{t('app:needsToBeUpdated')}</Text>
      <Button disabled={!googlePlayUrl} style={styles.button} onPress={() => Linking.openURL(googlePlayUrl)} title={t('common:update')} />
    </ScrollView>
  );
};

export default UpdateApp;
