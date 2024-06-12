import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  emptyItem: {
    width: '100%',
    height: '100%',
    padding: 15,
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: colors.primary_dark,
  },
  img: {
    width: 260,
    height: 395,
    backgroundColor: colors.neutral_medium,
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
    width: 300,
    height: 26,
    backgroundColor: colors.neutral_medium,
  },
  author: {
    marginTop: 10,
    width: 150,
    height: 22,
    backgroundColor: colors.neutral_medium,
  },
  category: {
    marginTop: 10,
    width: 130,
    height: 22,
    backgroundColor: colors.neutral_medium,
  },
  pages: {
    marginTop: 10,
    width: 70,
    height: 22,
    backgroundColor: colors.neutral_medium,
  },
  added: {
    marginTop: 10,
    width: 110,
    height: 22,
    backgroundColor: colors.neutral_medium,
  },
  footer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    width: 140,
    height: 34,
    backgroundColor: colors.neutral_medium,
  },
  votesCount: {
    marginLeft: 15,
    width: 40,
    height: 34,
    backgroundColor: colors.neutral_medium,
  },
  description: {
    marginTop: 15,
    width: '100%',
    height: 24,
    backgroundColor: colors.neutral_medium,
  },
});
