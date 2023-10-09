import React from 'react';
import { string } from 'prop-types';
import { View, Image, Text } from 'react-native';
import styles from './styles';

const Logo = ({ className }) => {
  return (
    <View style={styles.logoWrapper}>
      <Image source={require('~assets/logo.webp')} style={[styles.logo, className]} />
      <Text style={styles.title}>BookDesk</Text>
      <Text style={styles.subTitle}>Ваш список книг для чтения</Text>
    </View>
  );
};

Logo.propTypes = {
  className: string,
};

export default Logo;
