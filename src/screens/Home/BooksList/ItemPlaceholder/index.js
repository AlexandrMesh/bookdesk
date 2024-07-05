import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const ItemPlaceholder = () => {
  return (
    <View style={styles.emptyItem}>
      <View style={styles.leftSide}>
        <View style={styles.img} />
      </View>
      <View style={styles.rightSide}>
        <View style={styles.title} />
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
      </View>
    </View>
  );
};

export default ItemPlaceholder;
