import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  spinnerWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    padding: 15,
    backgroundColor: colors.primary_dark,
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 15,
    fontSize: 21,
    textAlign: 'center',
  },
  lightColor: {
    color: colors.neutral_light,
  },
  cover: {
    width: 260,
    height: 395,
    resizeMode: 'contain',
  },
  item: {
    fontSize: 18,
  },
  annotation: {
    fontSize: 18,
  },
  mediumColor: {
    color: colors.neutral_medium,
  },
  marginTop: {
    marginTop: 15,
  },
  info: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bookStatusWrapper: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingWrapper: {
    height: 30,
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  votesSpinnerWrapper: {
    marginLeft: 20,
    width: 70,
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  statusButton: {
    width: 150,
    height: 36,
  },
  votesCount: {
    fontSize: 18,
    marginLeft: 5,
  },
});
