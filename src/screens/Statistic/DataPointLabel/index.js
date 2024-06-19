import React from 'react';
import { View, Text } from 'react-native';
import { number } from 'prop-types';
import styles from './styles';

const DataPointLabel = ({ value }) => {
  return value ? (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{value}</Text>
    </View>
  ) : null;
};

export default DataPointLabel;

DataPointLabel.propTypes = {
  value: number,
};
