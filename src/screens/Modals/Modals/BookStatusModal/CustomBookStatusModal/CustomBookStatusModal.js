import React, { useState, useEffect } from 'react';
import { bool, string, func } from 'prop-types';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import Button from '~UI/Button';
import SlideMenu from '~UI/SlideMenu';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import BookStatusItem from '../BookStatusItem';
import styles from './styles';

const CustomBookStatusModal = ({ isVisible, status, setStatus, hideModal }) => {
  const { t } = useTranslation(['customBook', 'books', 'common']);
  const [newBookStatus, setNewBookStatus] = useState(status);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  const actionTypes = [
    { title: t('books:noStatus'), isSelected: newBookStatus === ALL, action: () => setNewBookStatus(ALL) },
    { title: t('books:planned'), isSelected: newBookStatus === PLANNED, action: () => setNewBookStatus(PLANNED) },
    { title: t('books:inProgress'), isSelected: newBookStatus === IN_PROGRESS, action: () => setNewBookStatus(IN_PROGRESS) },
    { title: t('books:completed'), isSelected: newBookStatus === COMPLETED, action: () => setNewBookStatus(COMPLETED) },
  ];

  useEffect(() => {
    setNewBookStatus(status);
    if (!isVisible) {
      setNewBookStatus(status);
    }
  }, [status, isVisible]);

  const handleSubmit = () => {
    setStatus(newBookStatus);
    setShouldAutoClose(true);
  };

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

  const handleClose = () => {
    hideModal();
  };

  return (
    <SlideMenu isVisible={isVisible} title={t('status')} onClose={handleClose} shouldAutoClose={shouldAutoClose} onReset={() => undefined}>
      <FlashList
        data={actionTypes}
        estimatedItemSize={actionTypes.length}
        renderItem={({ item }) => <BookStatusItem title={item.title} isSelected={item.isSelected} action={item.action} />}
        keyExtractor={({ title }) => title}
      />
      <View style={styles.submitButtonWrapper}>
        <Button style={styles.submitButton} title={t('common:save')} onPress={handleSubmit} />
      </View>
    </SlideMenu>
  );
};

CustomBookStatusModal.propTypes = {
  isVisible: bool,
  status: string,
  setStatus: func.isRequired,
  hideModal: func.isRequired,
};

export default CustomBookStatusModal;
