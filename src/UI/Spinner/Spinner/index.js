import React from 'react';
import { oneOf, string } from 'prop-types';
import { ActivityIndicator, View, Text } from 'react-native';
import colors from '~styles/colors';
import Size from '../constants/sizes';
import styles from '../styles';

const Spinner = ({ backgroundColor, color, labelColor, size, label }) => {
  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor,
        },
      ]}
    >
      <ActivityIndicator color={color} size={size} />
      {label && <Text style={[{ color: labelColor }, styles.label]}>{label}</Text>}
    </View>
  );
};

Spinner.defaultProps = {
  size: Size.LARGE,
  backgroundColor: colors.primary_dark,
  color: colors.neutral_light,
  labelColor: colors.neutral_light,
};

Spinner.propTypes = {
  color: string,
  label: string,
  size: oneOf([Size.SMALL, Size.LARGE]),
  backgroundColor: string,
  labelColor: string,
};

export default Spinner;
