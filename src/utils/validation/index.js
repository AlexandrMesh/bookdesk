import keyMirror from '~utils/keyMirror';
import isValidEmailPattern from './isValidEmailPattern';

// if val is null, undefined, empty string but not zero
const hasNoValue = (value) => !value && value !== 0;

// if the input val is too long
// default maxLength is 64
const isTooLong = (value, { maxLength = 64 }) => value.length >= maxLength;

// if the input val is too short
const isTooShort = (value, { minLength = 6 }) => value.length < minLength;

// if the input val is more than
const isMoreThan = (value, { moreComparedValue = 10 }) => Number(value) > moreComparedValue;

// if the input val is less than
const isLessThan = (value, { lessComparedValue = 1 }) => Number(value) < lessComparedValue;

// should be contain only letters
const mustContainOnlyLetters = (value) => !/^[а-яёa-z ]+$/i.test(value);

// should be contain only numbers
const mustContainOnlyNumbers = (value) => !/^[0-9]+$/.test(value);

// if the input value contains special characters
const containsSpecialCharacters = (value) => /[@^&/\\#+$~%;~`*<>=%[\]{}_|]/g.test(value);

// if the input val matches a predefined pattern
const isNotValidEmailPattern = (value) => !isValidEmailPattern(value);

// list of all generic validation functions
const validationFuncs = {
  hasNoValue,
  isTooLong,
  isNotValidEmailPattern,
  isTooShort,
  isMoreThan,
  isLessThan,
  mustContainOnlyLetters,
  containsSpecialCharacters,
  mustContainOnlyNumbers,
};

// exporting the enumerated rule types
export const validationTypes = keyMirror(Object.keys(validationFuncs));

// get validation errors
// "params" is an optional object to provide more validation parameters if needed.
export const getValidationFailure = (val, validationRules, params = {}) => {
  const value = val ? val.toString() : '';

  const failedRule = (validationRules || []).find((rule) => validationFuncs[rule](value, params));

  return failedRule;
};
