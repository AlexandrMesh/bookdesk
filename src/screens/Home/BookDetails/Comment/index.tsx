import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '~hooks';
import { useRoute, useIsFocused, RouteProp } from '@react-navigation/native';
import { MIN_COUNT_CHARACTERS_FOR_COMMENT, MAX_COUNT_CHARACTERS_FOR_COMMENT } from '~constants/bookList';
import { Spinner } from '~UI/Spinner';
import Button from '~UI/Button';
import { PENDING } from '~constants/loadingStatuses';
import { SECONDARY } from '~constants/themes';
import { getValidationFailure, validationTypes } from '~utils/validation';
import { getBookCommentUpdatingStatus, getBookCommentDeletingStatus, getBookCommentData } from '~redux/selectors/books';
import { updateUserComment, updateUserBookCommentInBookDetails, deleteUserComment } from '~redux/actions/booksActions';
import Input from '~UI/TextInput';
import styles from '../styles';

type ParamList = {
  BookDetails: {
    bookId: string;
  };
};

const Comment = () => {
  const { t, i18n } = useTranslation(['books', 'categories', 'common']);
  const { language } = i18n;
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const bookCommentUpdatingStatus = useAppSelector(getBookCommentUpdatingStatus);
  const bookCommentDeletingStatus = useAppSelector(getBookCommentDeletingStatus);
  const bookCommentData = useAppSelector(getBookCommentData);
  const [isCommentEditFormVisible, setIsCommentEditFormVisible] = useState(false);
  const [editedComment, setEditedComment] = useState(bookCommentData?.comment || '');
  const [editedCommentError, setEditedCommentError] = useState('');

  const displayEditCommentForm = useCallback(() => setIsCommentEditFormVisible(true), []);
  const hideEditCommentForm = useCallback(() => setIsCommentEditFormVisible(false), []);

  const { params } = useRoute<RouteProp<ParamList, 'BookDetails'>>();

  useEffect(() => {
    if (!isFocused) {
      hideEditCommentForm();
      setEditedComment('');
      setEditedCommentError('');
    }
  }, [isFocused, hideEditCommentForm]);

  const handleChangeComment = useCallback((value: string) => {
    setEditedComment(value);
    setEditedCommentError('');
  }, []);

  const handleDisplayEditCommentForm = useCallback(() => {
    setEditedCommentError('');
    setEditedComment(bookCommentData?.comment || '');
    displayEditCommentForm();
  }, [bookCommentData?.comment, displayEditCommentForm]);

  const validateComment = useCallback(() => {
    const params = {
      minLength: MIN_COUNT_CHARACTERS_FOR_COMMENT,
      maxLength: MAX_COUNT_CHARACTERS_FOR_COMMENT,
    };
    const error = getValidationFailure(
      editedComment.trim(),
      [validationTypes.containsSpecialCharacters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    setEditedCommentError(error ? t(`errors:${error}`, params) : '');
    return !error;
  }, [editedComment, t]);

  const handleSaveComment = useCallback(async () => {
    const isCommentValid = validateComment();

    if (isCommentValid) {
      try {
        const commentAdded = new Date().getTime();
        const { comment, added } = await dispatch(
          updateUserComment({ bookId: params?.bookId, comment: editedComment.trim(), added: commentAdded }),
        ).unwrap();
        dispatch(updateUserBookCommentInBookDetails({ comment, commentAdded: added }));
        hideEditCommentForm();
      } catch (error) {
        console.error(error);
      }
    }
  }, [dispatch, editedComment, hideEditCommentForm, params?.bookId, validateComment]);

  const handleDeleteComment = useCallback(async () => {
    try {
      await dispatch(deleteUserComment(params?.bookId));
      dispatch(updateUserBookCommentInBookDetails({ comment: '', commentAdded: 0 }));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, params?.bookId]);

  const isUpdatingComment = bookCommentUpdatingStatus === PENDING;
  const isDeletingComment = bookCommentDeletingStatus === PENDING;

  return (
    <View>
      {bookCommentData?.comment || isCommentEditFormVisible ? (
        <View style={[styles.bordered, styles.marginTop]}>
          <View style={styles.blockHeader}>
            <Text style={[styles.item, styles.mediumColor]}>{t('myComment')}</Text>
            {isCommentEditFormVisible ? (
              <Text style={styles.subTitle}>
                {t('common:charactersCount', { count: editedComment.trim().length, maxCount: MAX_COUNT_CHARACTERS_FOR_COMMENT })}
              </Text>
            ) : (
              <Text style={[styles.item, styles.mediumColor]}>{new Date(bookCommentData?.added).toLocaleDateString(language)}</Text>
            )}
          </View>
          {isCommentEditFormVisible ? (
            <Input
              placeholder={t('books:enterComment')}
              wrapperClassName={styles.commentWrapperClassName}
              className={styles.commentInput}
              onChangeText={handleChangeComment}
              value={editedComment}
              error={editedCommentError}
              shouldDisplayClearButton={!!editedComment && !isUpdatingComment}
              disabled={isUpdatingComment}
              onClear={() => setEditedComment('')}
              multiline
              numberOfLines={5}
            />
          ) : (
            <Text style={[styles.comment, styles.lightColor]}>{bookCommentData?.comment}</Text>
          )}
          <View style={styles.borderedBlockFooter}>
            {isCommentEditFormVisible ? (
              <>
                <Button
                  style={styles.commentButton}
                  titleStyle={styles.commentButtonTitle}
                  onPress={handleSaveComment}
                  disabled={isUpdatingComment}
                  icon={isUpdatingComment ? <Spinner size='small' /> : undefined}
                  title={t('common:save')}
                />
                <Button
                  theme={SECONDARY}
                  style={styles.commentButton}
                  disabled={isUpdatingComment}
                  titleStyle={styles.commentButtonTitle}
                  onPress={hideEditCommentForm}
                  title={t('common:cancel')}
                />
              </>
            ) : (
              <>
                <Button
                  style={styles.commentButton}
                  titleStyle={styles.commentButtonTitle}
                  onPress={handleDisplayEditCommentForm}
                  disabled={isDeletingComment}
                  title={t('common:edit')}
                />
                <Button
                  theme={SECONDARY}
                  style={styles.commentButton}
                  disabled={isDeletingComment}
                  icon={isDeletingComment ? <Spinner size='small' /> : undefined}
                  titleStyle={styles.commentButtonTitle}
                  onPress={handleDeleteComment}
                  title={t('common:remove')}
                />
              </>
            )}
          </View>
        </View>
      ) : null}
      {!isCommentEditFormVisible && !bookCommentData?.comment ? (
        <View style={[styles.bordered, styles.marginTop]}>
          <View style={styles.blockHeader}>
            <Text style={[styles.item, styles.mediumColor]}>{t('myComment')}</Text>
          </View>
          <View style={styles.borderedBlockFooter}>
            <Button
              style={styles.commentButton}
              titleStyle={styles.commentButtonTitle}
              onPress={handleDisplayEditCommentForm}
              title={t('common:add')}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Comment;
