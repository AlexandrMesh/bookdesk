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
        <View style={styles.category} />
        <View style={styles.pages} />
        <View style={styles.added} />
        <View style={styles.footer}>
          <View style={styles.button} />
          <View style={styles.votesCount} />
        </View>
        <View style={styles.description} />
        <View style={styles.description} />
        <View style={styles.description} />
      </View>
    </View>
  );
};

export default Placeholder;
