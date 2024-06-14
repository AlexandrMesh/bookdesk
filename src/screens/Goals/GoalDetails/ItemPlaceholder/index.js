import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const ItemPlaceholder = () => {
  return (
    <View style={styles.emptyItem}>
      <View style={styles.item} />
    </View>
  );
};

export default ItemPlaceholder;
