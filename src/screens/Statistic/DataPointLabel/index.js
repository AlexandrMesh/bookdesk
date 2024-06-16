import React from 'react';
import { View, Text } from 'react-native';
import { number } from 'prop-types';

const DataPointLabel = ({ value }) => {
  return value ? (
    <View style={{ top: -22, left: 5, backgroundColor: '#b1d4e0', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 5 }}>
      <Text style={{ color: '#09172a', fontSize: 15, fontWeight: 600 }}>{value}</Text>
    </View>
  ) : null;
};

export default DataPointLabel;

DataPointLabel.propTypes = {
  value: number,
};
