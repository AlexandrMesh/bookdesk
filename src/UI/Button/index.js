/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { bool, shape, string, func, node, oneOf, any } from 'prop-types';
import { TouchableHighlight, View, Text } from 'react-native';
import { PRIMARY, SECONDARY } from '~constants/themes';
import styles from './styles';

const Button = ({ icon, iconPosition, title, titleStyle, onPress, theme, style, iconClassName, disabled }) => {
  const getTheme = () => ({
    [PRIMARY]: styles.primary,
    [SECONDARY]: styles.secondary,
  });

  const handlePress = () => {
    if (!disabled) {
      onPress();
    } else {
      return undefined;
    }
    return true;
  };

  return (
    <TouchableHighlight disabled={disabled} style={[styles.button, getTheme()[theme], disabled ? styles.disabled : '', style]} onPress={handlePress}>
      <View style={styles.titleWrapper}>
        {icon && iconPosition === 'left' && <View style={[styles.icon, styles.iconLeft, iconClassName]}>{icon}</View>}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && <View style={[styles.icon, styles.iconRight, iconClassName]}>{icon}</View>}
      </View>
    </TouchableHighlight>
  );
};

Button.defaultProps = {
  theme: PRIMARY,
  iconPosition: 'left',
};

Button.propTypes = {
  icon: node,
  title: string.isRequired,
  titleStyle: any,
  onPress: func.isRequired,
  style: any,
  iconClassName: shape({}),
  disabled: bool,
  theme: oneOf([PRIMARY, SECONDARY]),
  iconPosition: oneOf(['left', 'right']),
};

export default Button;
