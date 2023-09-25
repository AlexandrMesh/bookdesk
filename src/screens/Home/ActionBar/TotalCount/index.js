import React from 'react';
import { number } from 'prop-types';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const TotalCount = ({ count }) => {
  const { t } = useTranslation(['books', 'common']);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{t('count', { count })}</Text>
    </View>
  );
};

TotalCount.propTypes = {
  count: number.isRequired,
};

export default TotalCount;
