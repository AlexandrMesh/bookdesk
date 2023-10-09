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
    borderTopColor: 'transparent',
    borderColor: colors.neutral_medium,
    borderTopWidth: 0,
  },
  leftSide: {
    width: 126,
    backgroundColor: colors.primary_light,
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
    justifyContent: 'space-between',
  },
  ratingWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  title: {
    fontSize: 16,
  },
  cover: {
    width: 126,
    height: 180,
  },
  info: {
    marginTop: 10,
  },
  item: {
    fontSize: 14,
  },
  lightColor: {
    color: colors.neutral_light,
  },
  mediumColor: {
    color: colors.neutral_medium,
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
