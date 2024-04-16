import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: '100%',
    width: '100%',
    display: 'flex',
    backgroundColor: colors.primary_dark,
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    maxWidth: 260,
  },
  inputWrapper: {
    marginTop: 15,
  },
  text: {
    fontSize: 17,
    color: colors.neutral_light,
  },
});
