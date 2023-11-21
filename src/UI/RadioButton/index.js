/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { bool, string, any } from 'prop-types';
import { RADIO_BUTTON_ICON } from '~constants/dimensions';
import RadioButtonOn from '~assets/radio-button-on.svg';
import RadioButtonOff from '~assets/radio-button-off.svg';
import colors from '~styles/colors';

const RadioButton = ({ isSelected, color, style }) =>
  isSelected ? (
    <RadioButtonOn style={style} width={RADIO_BUTTON_ICON.width} height={RADIO_BUTTON_ICON.height} fill={color || colors.neutral_light} />
  ) : (
    <RadioButtonOff style={style} width={RADIO_BUTTON_ICON.width} height={RADIO_BUTTON_ICON.height} fill={color || colors.neutral_light} />
  );

RadioButton.propTypes = {
  isSelected: bool,
  style: any,
  color: string,
};

export default RadioButton;
