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
    backgroundColor: '#09172a',
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
