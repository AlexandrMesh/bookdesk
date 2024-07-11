import React, { useState, useEffect } from 'react';
import { bool, string, func, shape } from 'prop-types';
import { useSelector } from 'react-redux';
import { Pressable, View, Text, Platform, UIManager, LayoutAnimation, Animated } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';
import { deriveUserBookRating } from '~redux/selectors/books';
import Button from '~UI/Button';
import { Spinner, Size } from '~UI/Spinner';
import SlideMenu from '~UI/SlideMenu';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { getValidationFailure, validationTypes } from '~utils/validation';
import { SECONDARY } from '~constants/themes';
import { COMMON_SLIDE_MENU_HEIGHT, BIG_SLIDE_MENU_HEIGHT } from '~constants/modalTypes';
import { PENDING } from '~constants/loadingStatuses';
import { MIN_COUNT_CHARACTERS_FOR_COMMENT, MAX_COUNT_CHARACTERS_FOR_COMMENT } from '~constants/bookList';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import Input from '~UI/TextInput';
import Rating from '~UI/Rating';
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
  updateUserComment,
  hideModal,
  boardType,
  bookComment,
  deleteUserComment,
  clearBookComment,
  updateUserBookCommentInBookDetails,
  updateUserBookRating,
  deleteUserBookRating,
}) => {
  const { t, i18n } = useTranslation(['books', 'common']);
  const bookRating = useSelector(deriveUserBookRating(book?.bookId))?.rating;
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
  const [internalBookRating, setInternalBookRating] = useState(bookRating);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = i18n;

  const animatedStyleForComment = useGetAnimatedPlaceholderStyle(bookCommentLoadingStatus === PENDING);

  const handleAction = (status) => {
    setAdded(new Date().getTime());
    setNewBookStatus(status);
    setShouldRecalculateDimensions(true);
    setMenuHeight(status !== ALL ? BIG_SLIDE_MENU_HEIGHT : COMMON_SLIDE_MENU_HEIGHT);
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
    if (isVisible) {
      const bookStatus = book?.bookStatus || ALL;
      setMenuHeight(bookStatus !== ALL ? BIG_SLIDE_MENU_HEIGHT : COMMON_SLIDE_MENU_HEIGHT);
      setNewBookStatus(bookStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setInternalBookRating(bookRating);
      clearBookComment();
      const loadData = async () => {
        try {
          setIsInitialLoading(true);
          setAdded(book?.added || new Date().getTime());
          if (book?.bookStatus && book?.bookStatus !== ALL) {
            const bookId = book?.bookId;
            const result = await Promise.all([getBookComment(bookId)]);
            setComment(result[0]?.comment || '');
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
    !(bookRating !== internalBookRating) &&
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
        if (bookRating !== internalBookRating) {
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
      minLength: MIN_COUNT_CHARACTERS_FOR_COMMENT,
      maxLength: MAX_COUNT_CHARACTERS_FOR_COMMENT,
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
            {comment && (
              <Text style={styles.subTitle}>
                {t('common:charactersCount', { count: comment.trim().length, maxCount: MAX_COUNT_CHARACTERS_FOR_COMMENT })}
              </Text>
            )}
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
              <Rating rating={internalBookRating} onChangeRating={setInternalBookRating} isLoading={isLoading} />
            </View>
            <Animated.View style={[styles.customItem, bookCommentLoadingStatus === PENDING ? { opacity: animatedStyleForComment } : {}]}>
              <View style={styles.menuItemTitleWrapper}>
                <View style={styles.menuItemTitleWrapperLeft}>
                  <Text style={styles.menuItemTitle}>{t('books:comment')}</Text>
                  {comment ? (
                    <Text style={styles.menuItemTitle} numberOfLines={1}>
                      :{' '}
                    </Text>
                  ) : null}
                  <Text style={styles.menuItemSubTitle} numberOfLines={1}>
                    {comment.trim()}
                  </Text>
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
            </Animated.View>
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

  return isVisible ? (
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
  ) : null;
};

BookStatusModal.propTypes = {
  bookCommentLoadingStatus: loadingDataStatusShape,
  isVisible: bool,
  book: shape({
    bookId: string,
    bookStatus: string,
  }),
  bookComment: string,
  getBookComment: func.isRequired,
  updateUserBookRating: func.isRequired,
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
