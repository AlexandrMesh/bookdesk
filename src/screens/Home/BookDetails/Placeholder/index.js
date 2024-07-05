import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Placeholder = () => {
  return (
    <View style={styles.emptyWrapper}>
      <View style={styles.emptyItem}>
        <View style={styles.header}>
          <View style={styles.img} />
          <View style={styles.title} />
          <View style={styles.author} />
        </View>
        <View style={styles.description} />
        <View style={styles.description} />
        <View style={styles.description} />
        <View style={styles.description} />
        <View style={styles.description} />
      </View>
    </View>
  );
};

export default Placeholder;
