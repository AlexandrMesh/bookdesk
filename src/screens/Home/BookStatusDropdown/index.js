/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { func, string, bool, any } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { updateUserBook, deleteUserComment, deleteUserBookRating } from '~redux/actions/booksActions';
import { getBoardType } from '~redux/selectors/books';
import { DROPDOWN_ICON } from '~constants/dimensions';
import DropdownIcon from '~assets/dropdown.svg';
import colors from '~styles/colors';
import styles from './styles';

const getStatusColor = (bookStatus) =>
  ({
    [PLANNED]: colors.planned,
    [IN_PROGRESS]: colors.in_progress,
    [COMPLETED]: colors.completed,
  }[bookStatus] || colors.neutral_light);

const BookStatusDropdown = ({ isLoading, bookStatus, bookId, onLoading, wrapperStyle, buttonLabelStyle }) => {
  const { t } = useTranslation('books');
  const dispatch = useDispatch();
  const boardType = useSelector(getBoardType);
  const statusColor = getStatusColor(bookStatus);

  const handleUpdateBookStatus = async (newBookStatus) => {
    const added = new Date().getTime();
    try {
      onLoading(true);
      if (newBookStatus === ALL) {
        await dispatch(deleteUserComment(bookId));
      }
      if (newBookStatus === ALL) {
        await dispatch(deleteUserBookRating(bookId));
      }
      await dispatch(
        updateUserBook({
          book: { bookId, bookStatus },
          added,
          newBookStatus,
          boardType,
        }),
      );
    } finally {
      onLoading(false);
    }
  };

  const actionTypes = [
    { title: t('noStatus'), value: ALL, noValue: undefined },
    {
      title: t('planned'),
      value: PLANNED,
    },
    { title: t('inProgress'), value: IN_PROGRESS },
    { title: t('completed'), value: COMPLETED },
  ];

  return (
    <SelectDropdown
      data={actionTypes}
      disableAutoScroll
      disabled={isLoading}
      onSelect={(selectedItem) => {
        if ((bookStatus || ALL) === selectedItem.value) {
          return;
        }
        handleUpdateBookStatus(selectedItem.value);
      }}
      renderButton={() => {
        return (
          <View style={[styles.dropdownButtonStyle, wrapperStyle, { borderColor: statusColor }]}>
            <View style={styles.status}>
              <Text style={[styles.dropdownButtonTxtStyle, buttonLabelStyle, { color: statusColor }]}>{t(bookStatus) || t('noStatus')}</Text>
              <DropdownIcon width={DROPDOWN_ICON.width} height={DROPDOWN_ICON.height} style={{ fill: statusColor }} />
            </View>
          </View>
        );
      }}
      renderItem={(item) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(item.value === (bookStatus || ALL) && { backgroundColor: colors.primary_medium }),
            }}
          >
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

BookStatusDropdown.propTypes = {
  isLoading: bool,
  bookStatus: string,
  bookId: string,
  onLoading: func.isRequired,
  wrapperStyle: any,
  buttonLabelStyle: any,
};

export default BookStatusDropdown;
