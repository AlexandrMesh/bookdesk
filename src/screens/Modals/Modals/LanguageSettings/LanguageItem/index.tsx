import React, { memo, FC } from 'react';
import { Text, Pressable } from 'react-native';
import RadioButton from '~UI/RadioButton';
import styles from './styles';

export type Props = {
  title?: string;
  isSelected: boolean;
  action: () => void;
  isLoading?: boolean;
};

const Item: FC<Props> = ({ title, isSelected, action, isLoading }) => {
  const handleItemPress = () => {
    if (!isLoading) {
      action();
    }
  };

  return (
    <Pressable style={styles.menuItem} onPress={() => handleItemPress()}>
      <Text style={styles.menuItemTitle}>{title}</Text>
      <RadioButton isSelected={isSelected} />
    </Pressable>
  );
};

export default memo(Item);
