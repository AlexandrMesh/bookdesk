import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  container: {
    paddingVertical: 10,
    height: '100%',
    width: '100%',
    display: 'flex',
    backgroundColor: colors.primary_dark,
  },
  header: {
    paddingHorizontal: 10,
  },
  title: {
    color: colors.neutral_light,
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
  },
});
