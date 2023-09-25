import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const EmptyResults = () => {
  const { t } = useTranslation('search');

  return (
    <View style={styles.wrapper}>
      <View style={styles.emptyResultsWrapper}>
        <Text style={styles.label}>{t('noResults')}</Text>
      </View>
    </View>
  );
};

export default EmptyResults;
