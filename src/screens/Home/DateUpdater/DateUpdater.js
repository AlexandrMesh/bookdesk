import React from 'react';
import { bool, number, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';

const DateUpdater = ({ added, isVisible, hideDateUpdater, updateUserBookAddedDate }) => {
  const { t } = useTranslation(['books', 'categories']);

  const handleConfirm = (selectedDate) => {
    const date = selectedDate.getTime();
    updateUserBookAddedDate(date);
    hideDateUpdater();
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
      onCancel={hideDateUpdater}
    />
  ) : null;
};

DateUpdater.propTypes = {
  added: number,
  isVisible: bool,
  hideDateUpdater: func.isRequired,
  updateUserBookAddedDate: func.isRequired,
};

export default DateUpdater;
