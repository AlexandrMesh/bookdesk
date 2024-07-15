import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  dropdownButtonStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    width: 126,
    height: 30,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  status: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButtonTxtStyle: {
    fontSize: 15,
    marginRight: 5,
  },
  dropdownMenuStyle: {
    backgroundColor: colors.primary_dark,
    borderWidth: 1,
    borderColor: colors.neutral_medium,
    shadowColor: colors.neutral_light,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.neutral_medium,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    color: colors.neutral_light,
  },
});
