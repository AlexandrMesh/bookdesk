import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  menuItem: {
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
  menuItemTitle: {
    fontSize: 16,
    color: colors.neutral_light,
  },
});
