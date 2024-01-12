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
import { getValidationFailure, validationTypes } from '~utils/validation';
import Input from '~UI/TextInput';
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
  const [shouldRecalculateDimensions, setShouldRecalculateDimensions] = useState(false);
  const [menuHeight, setMenuHeight] = useState(336);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const { language } = i18n;

  const handleAction = (status) => {
    setNewBookStatus(status);
    setShouldRecalculateDimensions(true);
    setMenuHeight(status !== ALL ? 436 : 336);
  };

  const showDatePicker = () => {
    if (!isLoading) {
      setIsVisibleDatePicker(true);
    }
  };
  const hideDatePicker = () => setIsVisibleDatePicker(false);

  const showCommentForm = () => {
    if (!isLoading) {
      setIsCommentFormVisible(true);
    }
  };
  const hideCommentForm = () => setIsCommentFormVisible(false);

  const actionTypes = [
    { title: t('noStatus'), isSelected: newBookStatus === ALL, action: () => handleAction(ALL) },
    {
      title: t('planned'),
      isSelected: newBookStatus === PLANNED,
      action: () => handleAction(PLANNED),
    },
    { title: t('inProgress'), isSelected: newBookStatus === IN_PROGRESS, action: () => handleAction(IN_PROGRESS) },
    { title: t('completed'), isSelected: newBookStatus === COMPLETED, action: () => handleAction(COMPLETED) },
  ];

  const handleConfirmChangeDate = (date) => {
    setAdded(date.getTime());
    hideDatePicker();
  };

  useEffect(() => {
    const bookStatus = book?.bookStatus || ALL;
    if (isVisible) {
      setMenuHeight(bookStatus !== ALL ? 436 : 336);
      setNewBookStatus(bookStatus);
      setAdded(book?.added || new Date().getTime());
    } else {
      hideCommentForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleUpdate = async () => {
    if (!isLoading) {
      await updateUserBook({
        book,
        added,
        newBookStatus,
        boardType,
      });
      setShouldRecalculateDimensions(false);
      setShouldAutoClose(true);
      if (boardType !== ALL) {
        LayoutAnimation.configureNext(layoutAnimConfig);
      }
    }
  };

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldRecalculateDimensions(false);
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

  const handleClose = () => {
    if (!isLoading) {
      setShouldRecalculateDimensions(false);
      hideModal();
    }
  };

  const validateComment = () => {
    const params = {
      minLength: 20,
      maxLength: 1000,
    };
    const error = getValidationFailure(
      comment,
      [validationTypes.containsSpecialCharacters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    setCommentError(error ? t(`errors:${error}`, params) : null);
    return !error;
  };

  const handleChangeComment = (value) => {
    setComment(value);
    setCommentError(null);
  };

  const handleSaveComment = () => {
    const isCommentValid = validateComment();

    if (isCommentValid) {
      console.log('comment saved, go back');
    }
  };

  return (
    <SlideMenu
      menuHeight={menuHeight}
      isVisible={isVisible}
      title={book?.title}
      onClose={handleClose}
      shouldAutoClose={shouldAutoClose}
      onReset={() => undefined}
      shouldRecalculateDimensions={shouldRecalculateDimensions}
    >
      {isCommentFormVisible ? (
        <View style={styles.commentFormWrapper}>
          <View style={styles.commentForm}>
            <View style={styles.labelWrapper}>
              <Text style={styles.subTitle}>
                {t('books:comment')}
                {t('common:required')}
              </Text>
              {comment && <Text style={styles.subTitle}>{t('common:charactersCount', { count: comment.length, maxCount: 1000 })}</Text>}
            </View>
            <Input
              placeholder={t('books:enterComment')}
              wrapperClassName={styles.commentWrapperClassName}
              className={styles.commentInput}
              onChangeText={handleChangeComment}
              value={comment}
              error={commentError}
              shouldDisplayClearButton={!!comment}
              onClear={() => setComment('')}
              multiline
              numberOfLines={5}
            />
          </View>
          <View style={[styles.buttonWrapper, styles.buttonsWrapper]}>
            <Button style={styles.rowButton} title={t('common:back')} disabled={isLoading} onPress={hideCommentForm} />
            <Button style={styles.rowButton} title={t('common:save')} disabled={isLoading} onPress={handleSaveComment} />
          </View>
        </View>
      ) : (
        <>
          <FlashList
            data={actionTypes}
            estimatedItemSize={actionTypes.length}
            renderItem={({ item }) => <BookStatusItem title={item.title} isSelected={item.isSelected} action={item.action} isLoading={isLoading} />}
            keyExtractor={({ title }) => title}
          />
          {newBookStatus !== ALL ? (
            <>
              <View style={styles.customItem}>
                <View>
                  <Text style={styles.menuItemTitle}>{t('books:dateAdded')}</Text>
                </View>
                <Pressable onPress={showDatePicker} style={styles.dateValue}>
                  <Text style={styles.menuItemTitle}>{new Date(added).toLocaleDateString(language)}</Text>
                </Pressable>
              </View>
              <View style={styles.customItem}>
                <View style={styles.menuItemTitleWrapper}>
                  <View style={styles.menuItemTitleWrapperLeft}>
                    <Text style={styles.menuItemTitle}>{t('books:comment')}</Text>
                    <Text style={styles.menuItemTitle} numberOfLines={1}>
                      :{' '}
                    </Text>
                    <Text style={styles.menuItemSubTitle} numberOfLines={1}>
                      Личный рейтинг книге 10 баллов и потому хочу написать этот комментарий для себя
                    </Text>
                  </View>
                </View>
                <View style={styles.commentButtonWrapper}>
                  <Button style={styles.commentButton} titleStyle={styles.commentButtonTitle} onPress={showCommentForm} title={t('common:add')} />
                </View>
              </View>
            </>
          ) : null}
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.submitButton}
              icon={isLoading && <Spinner size={Size.SMALL} />}
              title={t('common:save')}
              disabled={isLoading}
              onPress={handleUpdate}
            />
          </View>
        </>
      )}
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
