import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  container: {
    marginTop: 10,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
  },
  inputWrapper: {
    paddingHorizontal: 10,
  },
  bookListWrapper: {
    flex: 1,
    marginVertical: 10,
  },
  title: {
    color: colors.neutral_light,
    textAlign: 'center',
    fontSize: 24,
  },
  suggestionLabel: {
    color: colors.neutral_light,
    marginBottom: 10,
    textAlign: 'center',
  },
  nextButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    maxWidth: 200,
  },
});
