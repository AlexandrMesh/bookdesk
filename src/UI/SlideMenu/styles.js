import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  overlay: {
    backgroundColor: colors.neutral_black,
    opacity: 0.4,
    height: '100%',
    width: '100%',
    position: 'absolute',
    elevation: 5,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: '100%',
  },
  closeArea: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    elevation: 5,
  },
  content: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral_medium,
  },
  titleResetWrapper: {
    marginLeft: 10,
  },
  titleReset: {
    color: colors.neutral_medium,
  },
  closeIconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
});
