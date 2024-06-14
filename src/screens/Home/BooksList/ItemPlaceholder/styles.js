import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  emptyItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: colors.primary_dark,
    borderWidth: 1,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    borderColor: colors.neutral_medium,
    marginBottom: 1,
  },
  leftSide: {
    width: 126,
  },
  img: {
    width: 120,
    height: 170,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  moreDetails: {
    marginTop: 10,
    width: 120,
    height: 30,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  rightSide: {
    display: 'flex',
    marginLeft: 15,
    flex: 1,
  },
  title: {
    width: 200,
    height: 26,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  author: {
    marginTop: 10,
    width: 100,
    height: 20,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  category: {
    marginTop: 10,
    width: 130,
    height: 10,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  pages: {
    marginTop: 10,
    width: 70,
    height: 10,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  added: {
    marginTop: 10,
    width: 110,
    height: 10,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  footer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    width: 140,
    height: 30,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
  votesCount: {
    marginLeft: 15,
    width: 30,
    height: 30,
    opacity: 0.5,
    backgroundColor: colors.neutral_medium,
  },
});
