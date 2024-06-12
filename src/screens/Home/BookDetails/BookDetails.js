import React, { useState, useEffect } from 'react';
import { shape, func, string, number, arrayOf, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Pressable, ScrollView, SafeAreaView, Text, Image, Animated } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { Spinner, Size } from '~UI/Spinner';
import Button from '~UI/Button';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { SECONDARY } from '~constants/themes';
import { getImgUrl } from '~config/api';
import { getValidationFailure, validationTypes } from '~utils/validation';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import Input from '~UI/TextInput';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import { DROPDOWN_ICON, LIKE_ICON } from '~constants/dimensions';
import { BOOK_STATUS } from '~constants/modalTypes';
import StarIcon from '~assets/star.svg';
import FilledStarIcon from '~assets/star-filled.svg';
import LikeIcon from '~assets/like.svg';
import LikeFillIcon from '~assets/like_fill.svg';
import DropdownIcon from '~assets/dropdown.svg';
import colors from '~styles/colors';
import Placeholder from './Placeholder';
import styles from './styles';

const getStatusColor = (bookStatus) =>
  ({
    [PLANNED]: colors.planned,
    [IN_PROGRESS]: colors.in_progress,
    [COMPLETED]: colors.completed,
  }[bookStatus] || colors.neutral_light);

const BookDetails = ({
  loadingDataStatus,
  loadBookDetails,
  bookDetailsData,
  updateBookVotes,
  bookWithVote,
  updatingVoteForBook,
  showModal,
  selectBook,
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
}) => {
  const {
    title,
    coverPath,
    authorsList,
    pages,
    categoryPath,
    categoryValue,
    bookStatus,
    added,
    annotation,
    votesCount,
    comment,
    rating,
    commentAdded,
  } = bookDetailsData || {};
  const { t, i18n } = useTranslation(['books', 'categories', 'common']);
  const [imgUrl, setImgUrl] = useState('');
  const { language } = i18n;
  const isFocused = useIsFocused();
  const [isCommentEditFormVisible, setIsCommentEditFormVisible] = useState(false);
  const [editedComment, setEditedComment] = useState(comment || '');
  const [editedCommentError, setEditedCommentError] = useState('');
  const [internalBookRating, setInternalBookRating] = useState(rating);
  const [updatingRating, setUpdatingRating] = useState(false);

  const animatedStyleForVotes = useGetAnimatedPlaceholderStyle(updatingVoteForBook);
  const animatedStyleForRating = useGetAnimatedPlaceholderStyle(updatingRating);
  const animatedStyleForDate = useGetAnimatedPlaceholderStyle(bookValuesUpdatingStatus === PENDING);

  const displayEditCommentForm = () => setIsCommentEditFormVisible(true);
  const hideEditCommentForm = () => setIsCommentEditFormVisible(false);

  const { params } = useRoute();

  const statusColor = getStatusColor(bookStatus);

  const handleUpdateRating = async (value) => {
    try {
      setUpdatingRating(true);
      setInternalBookRating(value);
      const ratingAdded = new Date().getTime();
      await updateUserBookRating({ bookId: params?.bookId, rating: value, added: ratingAdded });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingRating(false);
    }
  };

  const ratingItems = [
    { id: '1', isSelected: internalBookRating >= 1, action: () => handleUpdateRating(1) },
    { id: '2', isSelected: internalBookRating >= 2, action: () => handleUpdateRating(2) },
    { id: '3', isSelected: internalBookRating >= 3, action: () => handleUpdateRating(3) },
    { id: '4', isSelected: internalBookRating >= 4, action: () => handleUpdateRating(4) },
    { id: '5', isSelected: internalBookRating >= 5, action: () => handleUpdateRating(5) },
  ];

  const clearBookRating = () => setInternalBookRating(0);

  useEffect(() => {
    setInternalBookRating(rating);
  }, [rating]);

  useEffect(() => {
    loadBookDetails({ bookId: params?.bookId });
  }, [loadBookDetails, params]);

  useEffect(() => {
    if (!isFocused) {
      clearBookDetails();
      clearBookRating();
      hideEditCommentForm();
      setEditedComment('');
      setEditedCommentError('');
    }
  }, [isFocused, clearBookDetails]);

  const handleChangeStatus = () => {
    showModal(BOOK_STATUS);
    selectBook({ authorsList, title, coverPath, pages, votesCount, categoryPath, bookId: params?.bookId, categoryValue, added, bookStatus });
  };

  const handleAddedPress = () => {
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
    setEditedComment(comment || '');
    displayEditCommentForm();
  };

  const validateComment = () => {
    const params = {
      minLength: 5,
      maxLength: 1000,
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
      <ScrollView keyboardShouldPersistTaps='handled'>
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
        <View styles={styles.info}>
          <Text style={[styles.item, styles.lightColor, styles.marginTop]}>{t(`categories:${categoryValue}`)}</Text>
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
          <View style={styles.bookStatusWrapper}>
            <Button
              title={t(bookStatus) || t('noStatus')}
              style={[styles.statusButton, { borderColor: statusColor }]}
              titleStyle={[styles.buttonTitle, { color: statusColor }]}
              icon={<DropdownIcon width={DROPDOWN_ICON.width} height={DROPDOWN_ICON.height} style={{ fill: statusColor }} />}
              iconPosition='right'
              iconClassName={styles.buttonIcon}
              theme={SECONDARY}
              onPress={handleChangeStatus}
            />
            <Animated.View style={updatingVoteForBook ? { opacity: animatedStyleForVotes } : {}}>
              <Pressable onPress={() => updateBookVotes({ bookId: params?.bookId, shouldAdd: !bookWithVote, bookStatus })} style={styles.voteWrapper}>
                {bookWithVote ? (
                  <LikeFillIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
                ) : (
                  <LikeIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
                )}
                <Text style={[styles.lightColor, styles.votesCount]}>{votesCount}</Text>
              </Pressable>
            </Animated.View>
          </View>

          {bookStatus ? (
            <View style={[styles.bordered, styles.marginTop]}>
              <View style={styles.blockHeader}>
                <View style={styles.ratingLabel}>
                  <View>
                    <Text style={[styles.item, styles.mediumColor]}>{t('rating')}</Text>
                  </View>
                </View>
                <Animated.View style={[styles.ratingWrapper, updatingRating ? { opacity: animatedStyleForRating } : {}]}>
                  {ratingItems.map(({ id, isSelected, action }) => {
                    return (
                      <Pressable
                        key={id}
                        onPress={() => {
                          if (!updatingRating) {
                            action();
                          }
                        }}
                      >
                        {isSelected ? <FilledStarIcon width={32} height={32} /> : <StarIcon width={32} height={32} />}
                      </Pressable>
                    );
                  })}
                </Animated.View>
              </View>
            </View>
          ) : null}

          {bookStatus && (comment || isCommentEditFormVisible) ? (
            <View style={[styles.bordered, styles.marginTop]}>
              <View style={styles.blockHeader}>
                <Text style={[styles.item, styles.mediumColor]}>{t('myComment')}</Text>
                {isCommentEditFormVisible ? (
                  <Text style={styles.subTitle}>{t('common:charactersCount', { count: editedComment.trim().length, maxCount: 1000 })}</Text>
                ) : (
                  <Text style={[styles.item, styles.mediumColor]}>{new Date(commentAdded).toLocaleDateString(language)}</Text>
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
                <Text style={[styles.comment, styles.lightColor]}>{comment}</Text>
              )}
              <View style={styles.borderedBlockFooter}>
                {isCommentEditFormVisible ? (
                  <>
                    <Button
                      style={styles.commentButton}
                      titleStyle={styles.commentButtonTitle}
                      onPress={handleSaveComment}
                      disabled={isUpdatingComment}
                      icon={isUpdatingComment && <Spinner size={Size.SMALL} />}
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
          {bookStatus && !isCommentEditFormVisible && !comment ? (
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
          {annotation && (
            <View style={[styles.item, styles.mediumColor, styles.marginTop]}>
              <View>
                <Text style={[styles.item, styles.mediumColor]}>{t('annotation')}</Text>
              </View>
              <Text style={[styles.annotation, styles.lightColor]}>{annotation}</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  updateBookVotes: func.isRequired,
  setBookToUpdate: func.isRequired,
  setBookValuesToUpdate: func.isRequired,
  showDateUpdater: func.isRequired,
  showModal: func.isRequired,
  selectBook: func.isRequired,
  clearBookDetails: func.isRequired,
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
  bookWithVote: bool,
  updatingVoteForBook: bool,
};

export default BookDetails;
