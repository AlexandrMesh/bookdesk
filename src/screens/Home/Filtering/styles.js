import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    display: 'flex',
  },
  white: {
    color: '#fff',
  },
  menuItem: {
    height: 50,
    borderColor: colors.neutral_medium,
    paddingRight: 15,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.neutral_light,
  },
  arrowIconWrapper: {
    paddingRight: 10,
    width: 55,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelWrapper: {
    height: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
  },
  submitButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
  firstLevel: {
    width: 35,
  },
  collapsed: {
    transform: [{ rotate: '-90deg' }],
  },
});
