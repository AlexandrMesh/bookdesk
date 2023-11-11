import React from 'react';
import { bool, string, func } from 'prop-types';
import { Text, Pressable } from 'react-native';
import RadioButton from '~UI/RadioButton';
import styles from './styles';

const Item = ({ title, isSelected, action, isLoading }) => {
  const handleItemPress = (action) => {
    if (!isLoading) {
      action();
    }
  };

  return (
    <Pressable style={styles.menuItem} onPress={() => handleItemPress(action)}>
      <Text style={styles.menuItemTitle}>{title}</Text>
      <RadioButton isSelected={isSelected} />
    </Pressable>
  );
};

Item.propTypes = {
  title: string,
  isSelected: bool,
  action: func.isRequired,
  isLoading: bool,
};

export default Item;
