import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: 1,
    padding: 10,
    backgroundColor: colors.primary_dark,
  },
  content: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 5,
  },
  formWrapper: {
    paddingHorizontal: 40,
  },
  orWrapper: {
    marginVertical: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  neutralLight: {
    color: colors.neutral_light,
  },
  signUpWrapper: {
    marginTop: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
