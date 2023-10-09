import React, { useState, useEffect } from 'react';
import { bool, string, func, shape } from 'prop-types';
import { View, ToastAndroid, Platform, UIManager, LayoutAnimation } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import Button from '~UI/Button';
import { Spinner, Size } from '~UI/Spinner';
import SlideMenu from '~UI/SlideMenu';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import BookStatusItem from './BookStatusItem';
import styles from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const layoutAnimConfig = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

const BookStatusModal = ({ isVisible, book, updateUserBook, hideModal, boardType, isLoading }) => {
  const { t } = useTranslation(['books', 'common']);
  const [newBookStatus, setNewBookStatus] = useState(book?.bookStatus);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  const actionTypes = [
    { title: t('noStatus'), isSelected: newBookStatus === ALL, action: () => setNewBookStatus(ALL) },
    { title: t('planned'), isSelected: newBookStatus === PLANNED, action: () => setNewBookStatus(PLANNED) },
    { title: t('inProgress'), isSelected: newBookStatus === IN_PROGRESS, action: () => setNewBookStatus(IN_PROGRESS) },
    { title: t('completed'), isSelected: newBookStatus === COMPLETED, action: () => setNewBookStatus(COMPLETED) },
  ];

  useEffect(() => {
    const bookStatus = book?.bookStatus || ALL;
    setNewBookStatus(bookStatus);
    if (!isVisible) {
      setNewBookStatus(bookStatus);
    }
  }, [book?.bookStatus, isVisible]);

  const handleUpdate = async () => {
    if (!isLoading) {
      await updateUserBook({
        book,
        newBookStatus,
        boardType,
      });
      setShouldAutoClose(true);
      console.log('updated');
      if (boardType !== ALL) {
        LayoutAnimation.configureNext(layoutAnimConfig);
      }
      ToastAndroid.show(t('bookStatusUpdated'), ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

  const handleClose = () => {
    if (!isLoading) {
      hideModal();
    }
  };

  return (
    <SlideMenu isVisible={isVisible} title={t('choosingStatus')} onClose={handleClose} shouldAutoClose={shouldAutoClose} onReset={() => undefined}>
      <FlashList
        data={actionTypes}
        estimatedItemSize={actionTypes.length}
        renderItem={({ item }) => <BookStatusItem title={item.title} isSelected={item.isSelected} action={item.action} isLoading={isLoading} />}
        keyExtractor={({ title }) => title}
      />
      <View style={styles.submitButtonWrapper}>
        <Button icon={isLoading && <Spinner size={Size.SMALL} />} title={t('common:save')} disabled={isLoading} onPress={handleUpdate} />
      </View>
    </SlideMenu>
  );
};

BookStatusModal.propTypes = {
  isVisible: bool,
  book: shape({
    bookId: string,
    bookStatus: string,
  }),
  updateUserBook: func.isRequired,
  hideModal: func.isRequired,
  boardType: string,
  isLoading: bool,
};

export default BookStatusModal;
