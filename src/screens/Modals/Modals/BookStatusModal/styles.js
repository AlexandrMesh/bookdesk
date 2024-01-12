import { StyleSheet } from 'react-native';
import colors from '~styles/colors';

export default StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  buttonsWrapper: {
    justifyContent: 'space-between',
  },
  commentFormWrapper: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  commentForm: {
    padding: 10,
  },
  customItem: {
    height: 50,
    borderColor: colors.neutral_medium,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateValue: {
    display: 'flex',
    flexWrap: 'wrap',
    borderStyle: 'dotted',
    borderBottomWidth: 2,
    borderColor: colors.neutral_light,
  },
  commentWrapperClassName: {
    height: 240,
  },
  commentInput: {
    height: 210,
    textAlignVertical: 'top',
  },
  menuItemTitleWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemTitleWrapperLeft: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.neutral_light,
  },
  menuItemSubTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral_medium,
  },
  subTitle: {
    fontSize: 18,
    color: colors.neutral_light,
    marginBottom: 10,
  },
  labelWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentButton: {
    width: 100,
    height: 30,
  },
  commentButtonTitle: {
    fontSize: 14,
  },
  rowButton: {
    width: '48%',
    maxWidth: 400,
  },
  submitButton: {
    maxWidth: 400,
  },
});
