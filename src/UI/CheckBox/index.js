import React from 'react';
import { bool } from 'prop-types';
import CheckBoxChecked from '~assets/checkbox-checked.svg';
import CheckBoxBlank from '~assets/checkbox-blank.svg';
import CheckBoxIntdeterminate from '~assets/checkbox-indeterminate.svg';
import colors from '~styles/colors';

const CheckBox = ({ isChecked, indeterminate }) => {
  if (indeterminate) {
    return <CheckBoxIntdeterminate width='28' height='28' fill={colors.neutral_light} />;
  }
  return isChecked ? (
    <CheckBoxChecked width='28' height='28' fill={colors.neutral_light} />
  ) : (
    <CheckBoxBlank width='28' height='28' fill={colors.neutral_light} />
  );
};

CheckBox.propTypes = {
  isChecked: bool,
  indeterminate: bool,
};

export default CheckBox;
