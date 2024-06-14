import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const ItemPlaceholder = () => {
  return (
    <View style={styles.emptyItem}>
      <View style={styles.leftSide}>
        <View style={styles.img} />
        <View style={styles.moreDetails} />
      </View>
      <View style={styles.rightSide}>
        <View style={styles.title} />
        <View style={styles.author} />
        <View style={styles.category} />
        <View style={styles.pages} />
        <View style={styles.added} />
        <View style={styles.footer}>
          <View style={styles.button} />
          <View style={styles.votesCount} />
        </View>
      </View>
    </View>
  );
};

export default ItemPlaceholder;
