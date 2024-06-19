import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary_dark,
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 15,
    marginVertical: 15,
    color: colors.neutral_light,
  },
  info: {
    marginTop: 10,
  },
  label: {
    fontSize: 17,
    paddingHorizontal: 15,
    marginTop: 15,
    color: colors.neutral_light,
  },
  noDataLabel: {
    fontSize: 18,
    color: colors.neutral_light,
    textAlign: 'center',
  },
  highlightedCount: {
    color: colors.completed,
    fontWeight: 'bold',
  },
  viewWrapper: {
    backgroundColor: colors.primary_dark,
    padding: 15,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
