import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  bookItem: {
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
  },
  leftSide: {
    width: 126,
  },
  rightSide: {
    display: 'flex',
    marginLeft: 15,
    flex: 1,
  },
  footer: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingWrapper: {
    height: 30,
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  spinnerWrapper: {
    width: 70,
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
  },
  cover: {
    width: 126,
    height: 180,
  },
  info: {
    marginTop: 10,
  },
  item: {
    fontSize: 15,
  },
  lightColor: {
    color: colors.neutral_light,
  },
  mediumColor: {
    color: colors.neutral_medium,
  },
  votesCount: {
    marginLeft: 3,
  },
  buttonTitle: {
    fontSize: 15,
  },
  statusButton: {
    width: 140,
    height: 30,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  planned: {
    borderColor: colors.planned,
  },
  inProgress: {
    borderColor: colors.in_progress,
  },
  completed: {
    borderColor: colors.completed,
  },
});
