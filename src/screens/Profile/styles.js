import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    padding: 25,
    backgroundColor: colors.primary_dark,
  },
  profile: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  label: {
    fontSize: 18,
    color: colors.neutral_medium,
  },
  value: {
    fontSize: 18,
    color: colors.neutral_light,
  },
  buttonsWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    width: '50%',
  },
  marginTop: {
    marginTop: 15,
  },
});
