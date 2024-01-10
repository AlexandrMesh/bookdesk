import React, { useState, useEffect } from 'react';
import { bool, string, func, shape } from 'prop-types';
import { Pressable, View, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';
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
  const { t, i18n } = useTranslation(['books', 'common']);
  const [newBookStatus, setNewBookStatus] = useState(book?.bookStatus);
  const [isVisibleDatePicker, setIsVisibleDatePicker] = useState(false);
  const [added, setAdded] = useState(book?.added || new Date().getTime());
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  const { language } = i18n;

  const showDatePicker = () => {
    if (!isLoading) {
      setIsVisibleDatePicker(true);
    }
  };
  const hideDatePicker = () => setIsVisibleDatePicker(false);

  const actionTypes = [
    { title: t('noStatus'), isSelected: newBookStatus === ALL, action: () => setNewBookStatus(ALL) },
    { title: t('planned'), isSelected: newBookStatus === PLANNED, action: () => setNewBookStatus(PLANNED) },
    { title: t('inProgress'), isSelected: newBookStatus === IN_PROGRESS, action: () => setNewBookStatus(IN_PROGRESS) },
    { title: t('completed'), isSelected: newBookStatus === COMPLETED, action: () => setNewBookStatus(COMPLETED) },
  ];

  const handleConfirmChangeDate = (date) => {
    setAdded(date.getTime());
    hideDatePicker();
  };

  useEffect(() => {
    const bookStatus = book?.bookStatus || ALL;
    if (isVisible) {
      setNewBookStatus(bookStatus);
      setAdded(book?.added || new Date().getTime());
    }
  }, [book?.bookStatus, book?.added, isVisible]);

  const handleUpdate = async () => {
    if (!isLoading) {
      await updateUserBook({
        book,
        added,
        newBookStatus,
        boardType,
      });
      setShouldAutoClose(true);
      if (boardType !== ALL) {
        LayoutAnimation.configureNext(layoutAnimConfig);
      }
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
    <SlideMenu
      menuHeight={386}
      isVisible={isVisible}
      title={book?.title}
      onClose={handleClose}
      shouldAutoClose={shouldAutoClose}
      onReset={() => undefined}
    >
      <FlashList
        data={actionTypes}
        estimatedItemSize={actionTypes.length}
        renderItem={({ item }) => <BookStatusItem title={item.title} isSelected={item.isSelected} action={item.action} isLoading={isLoading} />}
        keyExtractor={({ title }) => title}
      />
      {newBookStatus !== ALL ? (
        <View style={styles.dateWrapper}>
          <View>
            <Text style={styles.menuItemTitle}>{t('books:dateAdded')}</Text>
          </View>
          <Pressable onPress={showDatePicker} style={styles.dateValue}>
            <Text style={styles.menuItemTitle}>{new Date(added).toLocaleDateString(language)}</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.submitButtonWrapper}>
        <Button
          style={styles.submitButton}
          icon={isLoading && <Spinner size={Size.SMALL} />}
          title={t('common:save')}
          disabled={isLoading}
          onPress={handleUpdate}
        />
      </View>
      {isVisibleDatePicker ? (
        <DatePicker
          modal
          theme='dark'
          mode='date'
          title={t('common:selectDate')}
          confirmText={t('common:confirm')}
          cancelText={t('common:cancel')}
          open={isVisibleDatePicker}
          date={new Date(added)}
          onConfirm={handleConfirmChangeDate}
          onCancel={hideDatePicker}
        />
      ) : null}
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
