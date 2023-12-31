import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  topWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  wrapper: {
    display: 'flex',
  },
  overlay: {
    flex: 1,
  },
  tappableOverlay: {
    flex: 1,
    backgroundColor: colors.neutral_black,
  },
  animatedWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  content: {
    height: '100%',
    display: 'flex',
    position: 'relative',
    backgroundColor: colors.primary_dark,
    elevation: 6,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingLeft: 15,
    paddingRight: 5,
    borderColor: colors.neutral_medium,
    borderBottomWidth: 1,
  },
  titleWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral_medium,
  },
  resetButton: {
    marginLeft: 15,
    width: 100,
    height: 30,
  },
  titleStyle: {
    fontSize: 16,
  },
  closeIconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
});
