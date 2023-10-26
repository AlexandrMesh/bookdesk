import React from 'react';
import { bool } from 'prop-types';
import { RADIO_BUTTON_ICON } from '~constants/dimensions';
import RadioButtonOn from '~assets/radio-button-on.svg';
import RadioButtonOff from '~assets/radio-button-off.svg';
import colors from '~styles/colors';

const RadioButton = ({ isSelected }) =>
  isSelected ? (
    <RadioButtonOn width={RADIO_BUTTON_ICON.width} height={RADIO_BUTTON_ICON.height} fill={colors.neutral_light} />
  ) : (
    <RadioButtonOff width={RADIO_BUTTON_ICON.width} height={RADIO_BUTTON_ICON.height} fill={colors.neutral_light} />
  );

RadioButton.propTypes = {
  isSelected: bool,
};

export default RadioButton;
