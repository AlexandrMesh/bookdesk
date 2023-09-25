/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { string, func, bool, oneOf, any } from 'prop-types';
import { View, TextInput, Text, Pressable } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import CloseIcon from '~assets/close.svg';
import colors from '~styles/colors';
import styles from './styles';

const Input = ({
  value,
  onChangeText,
  placeholder,
  error,
  disabled,
  secureTextEntry,
  wrapperClassName,
  className,
  shouldDisplayClearButton,
  onClear,
  inputMode,
  validateable,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = () => {
    if (!disabled) {
      setIsFocused(true);
    }
  };

  const onBlur = () => {
    if (!disabled) {
      setIsFocused(false);
    }
  };

  const handleChangeText = (value) => {
    if (!disabled) {
      onChangeText(value);
    }
  };

  return (
    <View style={[validateable ? styles.validateableWrapper : styles.wrapper, wrapperClassName]}>
      <View style={styles.inputWrapper}>
        <TextInput
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral_medium}
          style={[styles.input, isFocused ? styles.focusedInput : '', error ? styles.errorInput : '', disabled ? styles.disabled : '', className]}
          onChangeText={handleChangeText}
          value={value}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          inputMode={inputMode}
        />
        {shouldDisplayClearButton && (
          <Pressable onPress={onClear} style={styles.clearButtonWrapper}>
            <CloseIcon width='16' height='16' fill={isFocused ? colors.neutral_light : colors.neutral_medium} />
          </Pressable>
        )}
      </View>
      {validateable ? <View style={styles.errorWrapper}>{!isEmpty(error) && <Text style={styles.errorText}>{error}</Text>}</View> : null}
    </View>
  );
};

Input.defaultProps = {
  validateable: true,
  onClear: () => undefined,
};

Input.propTypes = {
  className: any,
  wrapperClassName: any,
  onChangeText: func.isRequired,
  value: string,
  placeholder: string,
  error: string,
  shouldDisplayClearButton: bool,
  onClear: func,
  disabled: bool,
  secureTextEntry: bool,
  validateable: bool,
  inputMode: oneOf(['decimal', 'email', 'none', 'numeric', 'search', 'tel', 'text', 'url']),
};

export default Input;
