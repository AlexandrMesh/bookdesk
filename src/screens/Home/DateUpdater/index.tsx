import React from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';
import { useAppDispatch, useAppSelector } from '~hooks';
import { getActiveModal, getBookToUpdate } from '~redux/selectors/books';
import { hideModal, updateUserBookAddedDate } from '~redux/actions/booksActions';
import { DATE_UPDATER } from '~constants/modalTypes';

const DateUpdater = () => {
  const { t } = useTranslation(['books', 'categories']);
  const dispatch = useAppDispatch();

  const _hideDateUpdater = () => dispatch(hideModal());
  const _updateUserBookAddedDate = (added: number) => dispatch(updateUserBookAddedDate(added));

  const isVisible = useAppSelector(getActiveModal) === DATE_UPDATER;
  const added = useAppSelector(getBookToUpdate)?.added;

  const handleConfirm = (selectedDate: Date) => {
    const date = selectedDate.getTime();
    _updateUserBookAddedDate(date);
    _hideDateUpdater();
  };

  return isVisible ? (
    <DatePicker
      modal
      theme='dark'
      mode='date'
      title={t('common:selectDate')}
      confirmText={t('common:confirm')}
      cancelText={t('common:cancel')}
      open={isVisible}
      date={added ? new Date(added) : new Date()}
      onConfirm={handleConfirm}
      onCancel={_hideDateUpdater}
    />
  ) : null;
};

export default DateUpdater;
