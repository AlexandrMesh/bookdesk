import React from 'react';
import { Animated, View } from 'react-native';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import styles from './styles';

const ItemPlaceholder = () => {
  const animatedStyle = useGetAnimatedPlaceholderStyle(true);

  return (
    <View style={styles.emptyItem}>
      <View style={styles.leftSide}>
        <Animated.View style={[styles.img, { opacity: animatedStyle }]} />
        <Animated.View style={[styles.moreDetails, { opacity: animatedStyle }]} />
      </View>
      <View style={styles.rightSide}>
        <Animated.View style={[styles.title, { opacity: animatedStyle }]} />
        <Animated.View style={[styles.author, { opacity: animatedStyle }]} />
        <Animated.View style={[styles.category, { opacity: animatedStyle }]} />
        <Animated.View style={[styles.pages, { opacity: animatedStyle }]} />
        <Animated.View style={[styles.added, { opacity: animatedStyle }]} />
        <View style={styles.footer}>
          <Animated.View style={[styles.button, { opacity: animatedStyle }]} />
          <Animated.View style={[styles.votesCount, { opacity: animatedStyle }]} />
        </View>
      </View>
    </View>
  );
};

export default ItemPlaceholder;
