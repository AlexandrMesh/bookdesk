import React, { useState, useEffect } from 'react';
import { shape, func, string, number, arrayOf } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { View, SafeAreaView, Text, Image, Animated } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { MIN_COUNT_CHARACTERS_FOR_COMMENT, MAX_COUNT_CHARACTERS_FOR_COMMENT } from '~constants/bookList';
import { Spinner, Size } from '~UI/Spinner';
import Button from '~UI/Button';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { SECONDARY } from '~constants/themes';
import { getImgUrl } from '~config/api';
import { getValidationFailure, validationTypes } from '~utils/validation';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import Input from '~UI/TextInput';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import Rating from '~UI/Rating';
import Like from '~UI/Like';
import Dropdown from '~UI/Dropdown';
import { deriveUserBookRating } from '~redux/selectors/books';
import Placeholder from './Placeholder';
import styles from './styles';

const BookDetails = ({
  loadingDataStatus,
  loadBookDetails,
  bookDetailsData,
  clearBookDetails,
  setBookToUpdate,
  setBookValuesToUpdate,
  showDateUpdater,
  bookValuesUpdatingStatus,
  updateUserComment,
  updateUserBookRating,
  updateUserBookCommentInBookDetails,
  bookCommentUpdatingStatus,
  deleteUserComment,
  bookCommentDeletingStatus,
  bookCommentData,
}) => {
  const { title, coverPath, authorsList, pages, categoryValue, bookStatus, added, votesCount, annotation } = bookDetailsData || {};
  const { t, i18n } = useTranslation(['books', 'categories', 'common']);
  const [imgUrl, setImgUrl] = useState('');
  const { language } = i18n;
  const isFocused = useIsFocused();
  const [isCommentEditFormVisible, setIsCommentEditFormVisible] = useState(false);
  const [editedComment, setEditedComment] = useState(bookCommentData?.comment || '');
  const [editedCommentError, setEditedCommentError] = useState('');
  const [updatingRating, setUpdatingRating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const animatedStyleForDate = useGetAnimatedPlaceholderStyle(bookValuesUpdatingStatus === PENDING);
  const animatedStyleForBookStatus = useGetAnimatedPlaceholderStyle(isUpdatingStatus);

  const displayEditCommentForm = () => setIsCommentEditFormVisible(true);
  const hideEditCommentForm = () => setIsCommentEditFormVisible(false);

  const { params } = useRoute();

  const bookRating = useSelector(deriveUserBookRating(params?.bookId))?.rating;

  const handleUpdateRating = async (value) => {
    try {
      setUpdatingRating(true);
      const ratingAdded = new Date().getTime();
      await updateUserBookRating({ bookId: params?.bookId, rating: value, added: ratingAdded });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingRating(false);
    }
  };

  useEffect(() => {
    loadBookDetails({ bookId: params?.bookId });
  }, [loadBookDetails, params]);

  useEffect(() => {
    if (!isFocused) {
      clearBookDetails();
      hideEditCommentForm();
      setEditedComment('');
      setEditedCommentError('');
    }
  }, [isFocused, clearBookDetails]);

  const handleAddedPress = () => {
    if (isUpdatingStatus) {
      return;
    }
    setBookToUpdate(params?.bookId, bookStatus);
    setBookValuesToUpdate(added);
    showDateUpdater();
  };

  const handleChangeComment = (value) => {
    setEditedComment(value);
    setEditedCommentError(null);
  };

  const handleDisplayEditCommentForm = () => {
    setEditedCommentError(null);
    setEditedComment(bookCommentData?.comment || '');
    displayEditCommentForm();
  };

  const validateComment = () => {
    const params = {
      minLength: MIN_COUNT_CHARACTERS_FOR_COMMENT,
      maxLength: MAX_COUNT_CHARACTERS_FOR_COMMENT,
    };
    const error = getValidationFailure(
      editedComment.trim(),
      [validationTypes.containsSpecialCharacters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    setEditedCommentError(error ? t(`errors:${error}`, params) : null);
    return !error;
  };

  const handleSaveComment = async () => {
    const isCommentValid = validateComment();

    if (isCommentValid) {
      try {
        const commentAdded = new Date().getTime();
        const { comment, added } = await updateUserComment({ bookId: params?.bookId, comment: editedComment.trim(), added: commentAdded });
        updateUserBookCommentInBookDetails(comment, added);
        hideEditCommentForm();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteUserComment(params?.bookId);
      updateUserBookCommentInBookDetails(null, null);
    } catch (error) {
      console.error(error);
    }
  };

  const isUpdatingComment = bookCommentUpdatingStatus === PENDING;
  const isDeletingComment = bookCommentDeletingStatus === PENDING;

  useEffect(() => {
    async function getData() {
      const response = await getImgUrl();
      setImgUrl(response);
    }
    getData();
  }, []);

  return loadingDataStatus === IDLE || loadingDataStatus === PENDING ? (
    <Placeholder />
  ) : (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView keyboardShouldPersistTaps='handled' style={isUpdatingStatus ? { opacity: animatedStyleForBookStatus } : {}}>
        <View style={styles.header}>
          {imgUrl && (
            <Image
              style={styles.cover}
              source={{
                uri: `${imgUrl}/${coverPath}.webp`,
              }}
            />
          )}
          <Text style={[styles.title, styles.lightColor]}>{title}</Text>
          {authorsList?.length > 0 &&
            authorsList.map((author) => (
              <View key={author}>
                <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
              </View>
            ))}
        </View>
        <View>
          <View style={styles.bookStatusWrapper}>
            <Dropdown
              isLoading={isUpdatingStatus}
              onLoading={setIsUpdatingStatus}
              bookStatus={bookStatus}
              bookId={params?.bookId}
              dropdownHeight={150}
              wrapperStyle={styles.statusButton}
              buttonLabelStyle={styles.buttonTitle}
            />
            <Like bookId={params?.bookId} bookStatus={bookStatus} votesCount={votesCount} />
          </View>
          <View style={[styles.info, styles.marginTop]}>
            <Text style={[styles.item, styles.lightColor]}>{t(`categories:${categoryValue}`)}</Text>
            {!!pages && (
              <Text style={[styles.item, styles.mediumColor]}>
                {t('pages')}
                <Text style={styles.lightColor}>{pages}</Text>
              </Text>
            )}
            {bookStatus && (
              <Text style={[styles.item, styles.mediumColor]}>
                {t('added')}
                <Animated.View style={[styles.addedContainer, bookValuesUpdatingStatus === PENDING ? { opacity: animatedStyleForDate } : {}]}>
                  <View style={styles.addedWrapper}>
                    <Text onPress={handleAddedPress} style={[styles.item, styles.lightColor]}>
                      {new Date(added).toLocaleDateString(language)}
                    </Text>
                  </View>
                </Animated.View>
              </Text>
            )}
          </View>

          {bookStatus ? (
            <View style={[styles.bordered, styles.marginTop]}>
              <View style={styles.blockHeader}>
                <View style={styles.ratingLabel}>
                  <View>
                    <Text style={[styles.item, styles.mediumColor]}>{t('rating')}</Text>
                  </View>
                </View>
                <Rating rating={bookRating} onChangeRating={handleUpdateRating} isLoading={updatingRating} />
              </View>
            </View>
          ) : null}

          {bookStatus && (bookCommentData?.comment || isCommentEditFormVisible) ? (
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
                  disabled={isUpdatingComment || isUpdatingStatus}
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
                      disabled={isUpdatingComment || isUpdatingStatus}
                      icon={isUpdatingComment && <Spinner size={Size.SMALL} />}
                      title={t('common:save')}
                    />
                    <Button
                      theme={SECONDARY}
                      style={styles.commentButton}
                      disabled={isUpdatingComment || isUpdatingStatus}
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
                      disabled={isDeletingComment || isUpdatingStatus}
                      title={t('common:edit')}
                    />
                    <Button
                      theme={SECONDARY}
                      style={styles.commentButton}
                      disabled={isDeletingComment || isUpdatingStatus}
                      icon={isDeletingComment && <Spinner size={Size.SMALL} />}
                      titleStyle={styles.commentButtonTitle}
                      onPress={handleDeleteComment}
                      title={t('common:remove')}
                    />
                  </>
                )}
              </View>
            </View>
          ) : null}
          {bookStatus && !isCommentEditFormVisible && !bookCommentData?.comment ? (
            <View style={[styles.bordered, styles.marginTop]}>
              <View style={styles.blockHeader}>
                <Text style={[styles.item, styles.mediumColor]}>{t('myComment')}</Text>
              </View>
              <View style={styles.borderedBlockFooter}>
                <Button
                  style={styles.commentButton}
                  disabled={isUpdatingStatus}
                  titleStyle={styles.commentButtonTitle}
                  onPress={handleDisplayEditCommentForm}
                  title={t('common:add')}
                />
              </View>
            </View>
          ) : null}
          {annotation && (
            <View style={[styles.item, styles.mediumColor, styles.marginTop]}>
              <View>
                <Text style={[styles.item, styles.mediumColor]}>{t('annotation')}</Text>
              </View>
              <Text style={[styles.annotation, styles.lightColor]}>{annotation}</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

BookDetails.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  bookValuesUpdatingStatus: loadingDataStatusShape,
  bookCommentUpdatingStatus: loadingDataStatusShape,
  bookCommentDeletingStatus: loadingDataStatusShape,
  updateUserComment: func.isRequired,
  updateUserBookRating: func.isRequired,
  deleteUserComment: func.isRequired,
  updateUserBookCommentInBookDetails: func.isRequired,
  loadBookDetails: func.isRequired,
  setBookToUpdate: func.isRequired,
  setBookValuesToUpdate: func.isRequired,
  showDateUpdater: func.isRequired,
  clearBookDetails: func.isRequired,
  bookCommentData: shape({
    comment: string,
    added: number,
  }),
  bookDetailsData: shape({
    title: string,
    authorsList: arrayOf(string),
    bookStatus: string,
    categoryPath: string,
    coverPath: string,
    votesCount: number,
    status: string,
    pages: number,
    added: number,
    annotation: string,
  }),
};

export default BookDetails;
