import React from 'react';
import { string } from 'prop-types';
import { ActivityIndicator, View, Text } from 'react-native';
import colors from '~styles/colors';
import styles from './styles';

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
  size: 'large',
  backgroundColor: colors.primary_dark,
  color: colors.neutral_light,
  labelColor: colors.neutral_light,
};

Spinner.propTypes = {
  color: string,
  label: string,
  size: string,
  backgroundColor: string,
  labelColor: string,
};

export default Spinner;
