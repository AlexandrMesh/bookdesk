import React from 'react';
import { string } from 'prop-types';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const Logo = ({ className }) => {
  const { t } = useTranslation('app');

  return (
    <View style={styles.logoWrapper}>
      <FastImage source={require('~assets/logo.webp')} style={[styles.logo, className]} />
      <Text style={styles.title}>{t('appName')}</Text>
      <Text style={styles.subTitle}>{t('appTitle')}</Text>
    </View>
  );
};

Logo.propTypes = {
  className: string,
};

export default Logo;
