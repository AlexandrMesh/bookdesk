import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.primary_dark,
  },
  content: {
    maxWidth: 800,
  },
  submitButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 10,
    fontSize: 17,
    color: colors.neutral_light,
  },
});
