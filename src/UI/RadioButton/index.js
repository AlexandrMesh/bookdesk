import React from 'react';
import { bool } from 'prop-types';
import RadioButtonOn from '~assets/radio-button-on.svg';
import RadioButtonOff from '~assets/radio-button-off.svg';
import colors from '~styles/colors';

const RadioButton = ({ isSelected }) =>
  isSelected ? (
    <RadioButtonOn width='28' height='28' fill={colors.neutral_light} />
  ) : (
    <RadioButtonOff width='28' height='28' fill={colors.neutral_light} />
  );

RadioButton.propTypes = {
  isSelected: bool,
};

export default RadioButton;
