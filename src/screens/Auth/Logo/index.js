import React from 'react';
import { string } from 'prop-types';
import { View, Image } from 'react-native';
import styles from './styles';

const Logo = ({ className }) => {
  return (
    <View style={styles.logoWrapper}>
      <Image source={require('~assets/logo.png')} style={[styles.logo, className]} />
    </View>
  );
};

Logo.propTypes = {
  className: string,
};

export default Logo;
