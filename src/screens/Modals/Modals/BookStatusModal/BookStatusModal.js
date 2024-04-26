import React, { useState, useEffect } from 'react';
import { bool, string, func, shape } from 'prop-types';
import { Pressable, View, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';
import Button from '~UI/Button';
import { Spinner, Size } from '~UI/Spinner';
import SlideMenu from '~UI/SlideMenu';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { getValidationFailure, validationTypes } from '~utils/validation';
import { SECONDARY } from '~constants/themes';
import { COMMON_SLIDE_MENU_HEIGHT, BIG_SLIDE_MENU_HEIGHT } from '~constants/modalTypes';
import { PENDING } from '~constants/loadingStatuses';
import Input from '~UI/TextInput';
import StarIcon from '~assets/star.svg';
import FilledStarIcon from '~assets/star-filled.svg';
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

const BookStatusModal = ({
  isVisible,
  book,
  updateUserBook,
  bookCommentLoadingStatus,
  getBookComment,
  getUserBookRating,
  updateUserComment,
  hideModal,
  boardType,
  bookComment,
  deleteUserComment,
  clearBookComment,
  updateUserBookCommentInBookDetails,
  userBookRatingLoadingStatus,
  updateUserBookRating,
  deleteUserBookRating,
}) => {
  const { t, i18n } = useTranslation(['books', 'common']);
  const [newBookStatus, setNewBookStatus] = useState(book?.bookStatus);
  const [isVisibleDatePicker, setIsVisibleDatePicker] = useState(false);
  const [added, setAdded] = useState(book?.added || new Date().getTime());
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  const [shouldRecalculateDimensions, setShouldRecalculateDimensions] = useState(false);
  const [menuHeight, setMenuHeight] = useState(336);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [savedComment, setSavedComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [bookRating, setBookRating] = useState(0);
  const [internalBookRating, setInternalBookRating] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = i18n;

  const clearBookRating = () => setInternalBookRating(0);

  const handleAction = (status) => {
    setAdded(new Date().getTime());
    setNewBookStatus(status);
    setShouldRecalculateDimensions(true);
    setMenuHeight(status !== ALL ? BIG_SLIDE_MENU_HEIGHT : COMMON_SLIDE_MENU_HEIGHT);
  };

  const handleChangeRating = (value) => {
    setInternalBookRating(value);
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

  const ratingItems = [
    { id: '1', isSelected: internalBookRating >= 1, action: () => handleChangeRating(1) },
    { id: '2', isSelected: internalBookRating >= 2, action: () => handleChangeRating(2) },
    { id: '3', isSelected: internalBookRating >= 3, action: () => handleChangeRating(3) },
    { id: '4', isSelected: internalBookRating >= 4, action: () => handleChangeRating(4) },
    { id: '5', isSelected: internalBookRating >= 5, action: () => handleChangeRating(5) },
  ];

  const handleConfirmChangeDate = (date) => {
    setAdded(date.getTime());
    hideDatePicker();
  };

  useEffect(() => {
    if (isVisible) {
      const bookStatus = book?.bookStatus || ALL;
      setMenuHeight(bookStatus !== ALL ? BIG_SLIDE_MENU_HEIGHT : COMMON_SLIDE_MENU_HEIGHT);
      setNewBookStatus(bookStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      clearBookRating();
      clearBookComment();
      const loadData = async () => {
        try {
          setIsInitialLoading(true);
          setAdded(book?.added || new Date().getTime());
          if (book?.bookStatus && book?.bookStatus !== ALL) {
            const bookId = book?.bookId;
            const result = await Promise.all([getBookComment(bookId), getUserBookRating(bookId)]);
            setComment(result[0]?.comment || '');
            const rating = result[1]?.rating || 0;
            setBookRating(rating);
            setInternalBookRating(rating);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsInitialLoading(false);
        }
      };
      loadData();
    } else {
      setComment('');
      setSavedComment('');
      hideCommentForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (bookComment) {
      setSavedComment(bookComment);
    }
  }, [bookComment]);

  const disabledSaveButton =
    !(
      !(book?.bookStatus === undefined && newBookStatus === ALL) &&
      (book?.bookStatus !== newBookStatus ||
        new Date(book?.added)?.toLocaleString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }) !==
          new Date(added)?.toLocaleString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }))
    ) &&
    !((bookComment && !savedComment) || (savedComment && newBookStatus === ALL)) &&
    !(bookRating !== internalBookRating && internalBookRating !== 0) &&
    !(bookRating && newBookStatus === ALL) &&
    !(savedComment && savedComment !== bookComment);

  const handleUpdate = async () => {
    if (!isLoading) {
      try {
        setIsLoading(true);

        if (
          !(book?.bookStatus === undefined && newBookStatus === ALL) &&
          (book?.bookStatus !== newBookStatus ||
            new Date(book?.added)?.toLocaleString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }) !==
              new Date(added)?.toLocaleString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }))
        ) {
          await updateUserBook({
            book,
            added,
            newBookStatus,
            boardType,
          });
        }

        if ((bookComment && !savedComment) || (savedComment && newBookStatus === ALL)) {
          await deleteUserComment(book.bookId);
        }
        if (bookRating !== internalBookRating && internalBookRating !== 0) {
          const added = new Date().getTime();
          await updateUserBookRating({ bookId: book.bookId, rating: internalBookRating, added });
        }
        if (bookRating && newBookStatus === ALL) {
          await deleteUserBookRating(book.bookId);
        }
        if (savedComment && savedComment !== bookComment) {
          const added = new Date().getTime();
          await updateUserComment({ bookId: book.bookId, comment: comment.trim(), added });
          updateUserBookCommentInBookDetails(comment.trim(), added);
        }
        setIsLoading(false);
        setShouldRecalculateDimensions(false);
        setShouldAutoClose(true);
        if (boardType !== ALL) {
          LayoutAnimation.configureNext(layoutAnimConfig);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
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
      comment.trim(),
      [validationTypes.containsSpecialCharacters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    setCommentError(error ? t(`errors:${error}`, params) : null);
    return !error;
  };

  const handleEditComment = (value) => {
    setComment(value);
    setCommentError(null);
  };

  const handleSaveComment = () => {
    const isCommentValid = validateComment();

    if (isCommentValid) {
      setSavedComment(comment);
      hideCommentForm();
    }
  };

  const handleRemoveBookComment = () => {
    setComment('');
    setSavedComment('');

    setCommentError(null);
    hideCommentForm();
  };

  const handleCloseCommentForm = () => {
    setComment(savedComment || bookComment || '');

    setCommentError(null);
    hideCommentForm();
  };

  const renderContent = () => {
    return isCommentFormVisible ? (
      <View style={styles.commentFormWrapper}>
        <View style={styles.commentForm}>
          <View style={styles.labelWrapper}>
            <Text style={styles.subTitle}>{t('books:comment')}</Text>
            {comment && <Text style={styles.subTitle}>{t('common:charactersCount', { count: comment.trim().length, maxCount: 1000 })}</Text>}
          </View>
          <Input
            placeholder={t('books:enterComment')}
            wrapperClassName={styles.commentWrapperClassName}
            className={styles.commentInput}
            onChangeText={handleEditComment}
            value={comment}
            error={commentError}
            shouldDisplayClearButton={!!comment}
            onClear={() => setComment('')}
            multiline
            numberOfLines={5}
          />
        </View>
        <View style={[styles.buttonWrapper, styles.buttonsWrapper]}>
          <Button
            theme={SECONDARY}
            style={[styles.rowButton, savedComment || bookComment ? styles.rowButton3 : null]}
            title={t('common:back')}
            disabled={isLoading}
            onPress={handleCloseCommentForm}
          />
          {savedComment || bookComment ? (
            <Button
              theme={SECONDARY}
              disabled={isLoading || !comment}
              style={styles.rowButton3}
              title={t('common:remove')}
              onPress={handleRemoveBookComment}
            />
          ) : null}

          <Button
            style={[styles.rowButton, savedComment || bookComment ? styles.rowButton3 : null]}
            disabled={isLoading}
            title={t('common:save')}
            onPress={handleSaveComment}
          />
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
              <Pressable disabled={isLoading} onPress={showDatePicker} style={styles.dateValue}>
                <Text style={styles.menuItemTitle}>{new Date(added).toLocaleDateString(language)}</Text>
              </Pressable>
            </View>
            <View style={styles.customItem}>
              <View>
                <Text style={styles.menuItemTitle}>{t('books:rating')}</Text>
              </View>
              <View style={styles.ratingWrapper}>
                {userBookRatingLoadingStatus === PENDING ? (
                  <View style={styles.loadingSpinnerWrapper}>
                    <Spinner />
                  </View>
                ) : (
                  ratingItems.map(({ id, isSelected, action }) => {
                    return (
                      <Pressable
                        key={id}
                        onPress={() => {
                          if (!isLoading) {
                            action();
                          }
                        }}
                      >
                        {isSelected ? <FilledStarIcon width={32} height={32} /> : <StarIcon width={32} height={32} />}
                      </Pressable>
                    );
                  })
                )}
              </View>
            </View>
            <View style={styles.customItem}>
              <View style={styles.menuItemTitleWrapper}>
                <View style={styles.menuItemTitleWrapperLeft}>
                  <Text style={styles.menuItemTitle}>{t('books:comment')}</Text>
                  {comment ? (
                    <Text style={styles.menuItemTitle} numberOfLines={1}>
                      :{' '}
                    </Text>
                  ) : null}
                  {bookCommentLoadingStatus === PENDING ? (
                    <View style={styles.loadingSpinnerWrapper}>
                      <Spinner />
                    </View>
                  ) : (
                    <Text style={styles.menuItemSubTitle} numberOfLines={1}>
                      {comment.trim()}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.commentButtonWrapper}>
                <Button
                  disabled={isLoading || bookCommentLoadingStatus === PENDING}
                  style={styles.commentButton}
                  titleStyle={styles.commentButtonTitle}
                  onPress={showCommentForm}
                  title={t(comment ? 'common:edit' : 'common:add')}
                />
              </View>
            </View>
          </>
        ) : null}
        <View style={styles.buttonWrapper}>
          <Button
            style={styles.submitButton}
            icon={isLoading && !isInitialLoading && <Spinner size={Size.SMALL} />}
            title={t('common:save')}
            disabled={disabledSaveButton || isLoading || isInitialLoading}
            onPress={handleUpdate}
          />
        </View>
      </>
    );
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
      {renderContent()}
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
  bookCommentLoadingStatus: loadingDataStatusShape,
  userBookRatingLoadingStatus: loadingDataStatusShape,
  isVisible: bool,
  book: shape({
    bookId: string,
    bookStatus: string,
  }),
  bookComment: string,
  getBookComment: func.isRequired,
  updateUserBookRating: func.isRequired,
  getUserBookRating: func.isRequired,
  updateUserBookCommentInBookDetails: func.isRequired,
  clearBookComment: func.isRequired,
  updateUserComment: func.isRequired,
  updateUserBook: func.isRequired,
  deleteUserComment: func.isRequired,
  hideModal: func.isRequired,
  deleteUserBookRating: func.isRequired,
  boardType: string,
};

export default BookStatusModal;
