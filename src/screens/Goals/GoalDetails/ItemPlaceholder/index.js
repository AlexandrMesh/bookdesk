import React from 'react';
import { Animated, View } from 'react-native';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import styles from './styles';

const ItemPlaceholder = () => {
  const animatedStyle = useGetAnimatedPlaceholderStyle(true);

  return (
    <View style={styles.emptyItem}>
      <Animated.View style={[styles.item, { opacity: animatedStyle }]} />
    </View>
  );
};

export default ItemPlaceholder;
