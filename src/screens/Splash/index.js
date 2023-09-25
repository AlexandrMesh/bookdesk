import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Spinner from '~UI/Spinner';
import styles from './styles';

const Splash = () => {
  const { t } = useTranslation('auth');

  return (
    <View style={styles.wrapper}>
      <Spinner label={t('authProcess')} />
    </View>
  );
};

export default Splash;
