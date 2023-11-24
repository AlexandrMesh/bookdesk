/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { string, func, bool, oneOf, any, number } from 'prop-types';
import { View, TextInput, Text, Pressable } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import { CLOSE_ICON } from '~constants/dimensions';
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
  numberOfLines,
  multiline,
  errorWrapperClassName,
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
          style={[
            styles.input,
            shouldDisplayClearButton && styles.inputWithClearButton,
            isFocused ? styles.focusedInput : '',
            error ? styles.errorInput : '',
            disabled ? styles.disabled : '',
            className,
          ]}
          onChangeText={handleChangeText}
          value={value}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          inputMode={inputMode}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlign='left'
        />
        {shouldDisplayClearButton && (
          <Pressable onPress={onClear} style={styles.clearButtonWrapper}>
            <CloseIcon width={CLOSE_ICON.width} height={CLOSE_ICON.height} fill={isFocused ? colors.neutral_light : colors.neutral_medium} />
          </Pressable>
        )}
      </View>
      {validateable ? (
        <View style={[styles.errorWrapper, errorWrapperClassName]}>{!isEmpty(error) && <Text style={styles.errorText}>{error}</Text>}</View>
      ) : null}
    </View>
  );
};

Input.defaultProps = {
  validateable: true,
  onClear: () => undefined,
  numberOfLines: 1,
};

Input.propTypes = {
  className: any,
  wrapperClassName: any,
  errorWrapperClassName: any,
  onChangeText: func.isRequired,
  value: string,
  placeholder: string,
  error: string,
  shouldDisplayClearButton: bool,
  onClear: func,
  disabled: bool,
  secureTextEntry: bool,
  numberOfLines: number,
  multiline: bool,
  validateable: bool,
  inputMode: oneOf(['decimal', 'email', 'none', 'numeric', 'search', 'tel', 'text', 'url']),
};

export default Input;
