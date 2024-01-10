import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  submitButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  dateWrapper: {
    height: 50,
    borderColor: colors.neutral_medium,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateValue: {
    display: 'flex',
    flexWrap: 'wrap',
    borderStyle: 'dotted',
    borderBottomWidth: 2,
    borderColor: colors.neutral_light,
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.neutral_light,
  },
  submitButton: {
    maxWidth: 400,
  },
});
